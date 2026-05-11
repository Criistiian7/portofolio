import type { DatabaseHandle } from "../db.js";
import type { IngestBody, IngestEvent } from "../schema/ingest.js";
import { floorTo5m, hourBucketId } from "../rollup/buckets.js";
import { mergeRollupBatch, type RollupMergeInput } from "../rollup/mergeRollup.js";
import { METRIC_REGISTRY, type HeadlineMetricKey } from "../registry/headlineMetrics.js";
import { updateEwmaForBucket } from "../intelligence/baselines.js";
import { evaluateRulesForObservation } from "../alerts/evaluateRules.js";
import { scoreMultivariateForBucket } from "../intelligence/multivariate.js";
import type { AppConfig } from "../config.js";
import { PipelineCounters } from "../pipeline/counters.js";

export type QueuedIngest = {
  body: IngestBody;
  receivedAt: number;
};

export function processIngestBatch(db: DatabaseHandle, cfg: AppConfig, queued: QueuedIngest): void {
  const { body, receivedAt } = queued;
  const rollupDeltas = new Map<string, RollupMergeInput>();

  const bumpRollup = (metricKey: HeadlineMetricKey, ts: number, value: number, count: number) => {
    const bucketStart = floorTo5m(ts);
    const key = `${bucketStart}::${metricKey}`;
    const w = value * count;
    const existing = rollupDeltas.get(key);
    if (!existing) {
      rollupDeltas.set(key, {
        bucketStart,
        metricKey,
        weightedSum: w,
        sampleCount: count,
        minV: value,
        maxV: value,
      });
    } else {
      existing.weightedSum += w;
      existing.sampleCount += count;
      existing.minV = Math.min(existing.minV, value);
      existing.maxV = Math.max(existing.maxV, value);
    }
  };

  const insertRaw = db.prepare(`
    INSERT INTO raw_events (hour_bucket, received_at, source, schema_version, event_type, payload_json)
    VALUES (@hour_bucket, @received_at, @source, @schema_version, @event_type, @payload_json)
  `);

  const insertDeploy = db.prepare(`
    INSERT INTO deploy_markers (ts, commit_hash, build_id, version, environment, service, region, note, source)
    VALUES (@ts, @commit_hash, @build_id, @version, @environment, @service, @region, @note, @source)
  `);

  const tx = db.transaction(() => {
    for (const ev of body.events) {
      applyEvent(ev, body, receivedAt, { insertRaw, insertDeploy, bumpRollup });
    }

    const merged = mergeRollupBatch(db, [...rollupDeltas.values()]);
    if (merged > 0) {
      PipelineCounters.rollupUpdate(db, merged);
    }

    const touchedBuckets = new Set<number>();
    for (const r of rollupDeltas.values()) {
      touchedBuckets.add(r.bucketStart);
    }
    for (const bucketStart of touchedBuckets) {
      for (const metricKey of Object.keys(METRIC_REGISTRY) as HeadlineMetricKey[]) {
        const row = db
          .prepare(
            `SELECT sample_count, sum_values FROM rollup_5m WHERE bucket_start = ? AND metric_key = ?`,
          )
          .get(bucketStart, metricKey) as { sample_count: number; sum_values: number } | undefined;
        if (!row || row.sample_count === 0) continue;
        const observation = row.sum_values / row.sample_count;
        updateEwmaForBucket(db, metricKey, bucketStart, observation);
        evaluateRulesForObservation(db, {
          metricKey,
          bucketStart,
          observation,
          source: body.source,
        });
      }
      scoreMultivariateForBucket(db, cfg, bucketStart);
    }
  });

  tx();
}

function applyEvent(
  ev: IngestEvent,
  body: IngestBody,
  receivedAt: number,
  ctx: {
    insertRaw: ReturnType<DatabaseHandle["prepare"]>;
    insertDeploy: ReturnType<DatabaseHandle["prepare"]>;
    bumpRollup: (m: HeadlineMetricKey, ts: number, v: number, c: number) => void;
  },
) {
  if (ev.type === "sample") {
    ctx.insertRaw.run({
      hour_bucket: hourBucketId(ev.ts),
      received_at: receivedAt,
      source: body.source,
      schema_version: body.schemaVersion,
      event_type: "sample",
      payload_json: JSON.stringify(ev),
    });
    const c = ev.count ?? 1;
    ctx.bumpRollup(ev.metricKey, ev.ts, ev.value, c);
    return;
  }

  if (ev.type === "log") {
    ctx.insertRaw.run({
      hour_bucket: hourBucketId(ev.ts),
      received_at: receivedAt,
      source: body.source,
      schema_version: body.schemaVersion,
      event_type: "log",
      payload_json: JSON.stringify(ev),
    });
    return;
  }

  if (ev.type === "deploy") {
    ctx.insertRaw.run({
      hour_bucket: hourBucketId(ev.ts),
      received_at: receivedAt,
      source: body.source,
      schema_version: body.schemaVersion,
      event_type: "deploy",
      payload_json: JSON.stringify(ev),
    });
    const r = ev.release;
    ctx.insertDeploy.run({
      ts: ev.ts,
      commit_hash: r.commit ?? null,
      build_id: r.buildId ?? null,
      version: r.version ?? null,
      environment: r.environment ?? null,
      service: r.service ?? null,
      region: r.region ?? null,
      note: ev.note ?? null,
      source: body.source,
    });
  }
}
