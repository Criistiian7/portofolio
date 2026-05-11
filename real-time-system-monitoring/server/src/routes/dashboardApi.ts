import type { FastifyInstance } from "fastify";
import type { DatabaseHandle } from "../db.js";
import type { AppConfig } from "../config.js";
import { readPipelineHealth } from "../pipeline/counters.js";
import { HEADLINE_METRIC_KEYS, METRIC_REGISTRY } from "../registry/headlineMetrics.js";
import {
  forecastThresholdCrossing,
  maeOnHoldout,
  type RollupPoint,
} from "../intelligence/forecast.js";
import { retentionPolicyFromEnv } from "../registry/privacyRetention.js";
import { acknowledgeAlert, muteAlert, resolveAlert } from "../alerts/alertActions.js";

function assertAdmin(req: { headers: Record<string, string | string[] | undefined> }, cfg: AppConfig) {
  const auth = req.headers.authorization;
  const token = typeof auth === "string" && auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!cfg.ingestApiKeys.has(token)) {
    return false;
  }
  return true;
}

export async function registerDashboardApi(
  app: FastifyInstance,
  deps: { db: DatabaseHandle; cfg: AppConfig },
) {
  const { db, cfg } = deps;

  app.get("/api/healthz", async () => ({ ok: true }));

  app.get("/api/pipeline-health", async () => readPipelineHealth(db));

  app.get("/api/registry", async () => ({
    metrics: METRIC_REGISTRY,
    headlineOrder: HEADLINE_METRIC_KEYS,
    retention: retentionPolicyFromEnv(cfg.retentionMetricsDays, cfg.retentionLogsDays),
  }));

  app.get("/api/rollups", async (req) => {
    const q = req.query as { limit?: string };
    const limit = Math.min(500, Math.max(10, Number(q.limit ?? 120)));
    const rows = db
      .prepare(
        `
        SELECT bucket_start AS bucketStart, metric_key AS metricKey, sample_count AS sampleCount,
               sum_values AS sumValues, min_v AS minV, max_v AS maxV
        FROM rollup_5m
        ORDER BY bucket_start DESC
        LIMIT ?
      `,
      )
      .all(limit) as {
      bucketStart: number;
      metricKey: string;
      sampleCount: number;
      sumValues: number;
      minV: number | null;
      maxV: number | null;
    }[];

    return rows.map((r) => ({
      ...r,
      avg: r.sampleCount ? r.sumValues / r.sampleCount : null,
    }));
  });

  app.get("/api/timeline", async (req) => {
    const q = req.query as { from?: string; to?: string };
    const now = Date.now();
    let to = Number(q.to);
    let from = Number(q.from);
    if (!Number.isFinite(to)) to = now;
    if (!Number.isFinite(from)) from = to - 6 * 60 * 60 * 1000;

    const deploys = db
      .prepare(
        `SELECT ts, commit_hash AS commitHash, build_id AS buildId, version, environment, service, region, note, source
         FROM deploy_markers WHERE ts BETWEEN ? AND ? ORDER BY ts ASC`,
      )
      .all(from, to);

    const alerts = db
      .prepare(
        `SELECT id, dedupe_key AS dedupeKey, title, severity, state, fired_at AS firedAt,
                acknowledged_at AS acknowledgedAt, resolved_at AS resolvedAt, mute_until AS muteUntil, metadata_json AS metadataJson
         FROM alerts WHERE fired_at BETWEEN ? AND ? ORDER BY fired_at ASC`,
      )
      .all(from - 24 * 3600000, to);

    const mv = db
      .prepare(
        `SELECT bucket_start AS bucketStart, score, model_version AS modelVersion, computed_at AS computedAt
         FROM multivariate_scores WHERE bucket_start BETWEEN ? AND ? ORDER BY bucket_start ASC`,
      )
      .all(from, to);

    return { window: { from, to }, deploys, alerts, multivariate: mv };
  });

  app.get("/api/forecasts", async () => {
    const out = [];
    for (const metricKey of HEADLINE_METRIC_KEYS) {
      const rows = db
        .prepare(
          `
          SELECT bucket_start AS bucketStart, sum_values / sample_count AS value
          FROM rollup_5m
          WHERE metric_key = ?
          ORDER BY bucket_start DESC
          LIMIT 48
        `,
        )
        .all(metricKey) as RollupPoint[];
      rows.reverse();
      out.push(forecastThresholdCrossing(metricKey, rows, cfg.forecastModelVersion));
    }
    return { forecasts: out, suggestOnly: true };
  });

  app.get("/api/top-movers", async () => {
    const latestTwo = db
      .prepare(
        `
        SELECT DISTINCT bucket_start AS b
        FROM rollup_5m
        ORDER BY bucket_start DESC
        LIMIT 2
      `,
      )
      .all() as { b: number }[];
    if (latestTwo.length < 2) return { movers: [] };
    const [b0, b1] = [latestTwo[0].b, latestTwo[1].b];

    const cur = db
      .prepare(`SELECT metric_key AS k, sum_values / sample_count AS v FROM rollup_5m WHERE bucket_start = ?`)
      .all(b0) as { k: string; v: number }[];
    const prev = db
      .prepare(`SELECT metric_key AS k, sum_values / sample_count AS v FROM rollup_5m WHERE bucket_start = ?`)
      .all(b1) as { k: string; v: number }[];

    const mapPrev = new Map(prev.map((r) => [r.k, r.v]));
    const movers = cur
      .map((c) => ({
        metricKey: c.k,
        delta: c.v - (mapPrev.get(c.k) ?? c.v),
        current: c.v,
        previous: mapPrev.get(c.k) ?? null,
      }))
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

    return { window: { currentBucket: b0, previousBucket: b1 }, movers };
  });

  app.get("/api/alerts", async () => {
    return db
      .prepare(
        `SELECT id, dedupe_key AS dedupeKey, title, severity, state, fired_at AS firedAt,
                acknowledged_at AS acknowledgedAt, resolved_at AS resolvedAt, mute_until AS muteUntil, metadata_json AS metadataJson
         FROM alerts ORDER BY fired_at DESC LIMIT 200`,
      )
      .all();
  });

  app.get("/api/evaluation", async () => {
    const rows = db
      .prepare(
        `SELECT metadata_json AS metadataJson, severity, state FROM alerts WHERE metadata_json IS NOT NULL`,
      )
      .all() as { metadataJson: string; severity: string; state: string }[];

    let syntheticAlerts = 0;
    let liveAlerts = 0;
    for (const r of rows) {
      try {
        const meta = JSON.parse(r.metadataJson) as { source?: string };
        if (meta.source === "synthetic_replay") syntheticAlerts += 1;
        if (meta.source === "live") liveAlerts += 1;
      } catch {
        /* skip */
      }
    }

    const fprProxy =
      syntheticAlerts + liveAlerts === 0
        ? null
        : syntheticAlerts / Math.max(1, syntheticAlerts + liveAlerts);

    const maeByMetric: Record<string, number | null> = {};
    for (const metricKey of HEADLINE_METRIC_KEYS) {
      const pts = db
        .prepare(
          `
          SELECT sum_values / sample_count AS value
          FROM rollup_5m
          WHERE metric_key = ?
          ORDER BY bucket_start ASC
          LIMIT 64
        `,
        )
        .all(metricKey) as { value: number }[];
      const series = pts.map((p) => p.value);
      if (series.length < 5) {
        maeByMetric[metricKey] = null;
        continue;
      }
      const mae = maeOnHoldout(series, 0.25);
      maeByMetric[metricKey] = Number.isFinite(mae) ? mae : null;
    }

    return {
      note: "Portfolio evaluation: FPR proxy uses alert counts by labeled ingest source; MAE is a coarse holdout-style drift check, not production-grade calibration.",
      alertsLabeled: { synthetic: syntheticAlerts, live: liveAlerts },
      fprProxyOnSyntheticShare: fprProxy,
      maeHoldoutStyle: maeByMetric,
    };
  });

  app.post("/api/alerts/:id/ack", async (req, reply) => {
    if (!assertAdmin(req, cfg)) return reply.code(401).send({ error: "unauthorized" });
    acknowledgeAlert(db, (req.params as { id: string }).id);
    return { ok: true };
  });

  app.post("/api/alerts/:id/resolve", async (req, reply) => {
    if (!assertAdmin(req, cfg)) return reply.code(401).send({ error: "unauthorized" });
    resolveAlert(db, (req.params as { id: string }).id);
    return { ok: true };
  });

  app.post<{ Params: { id: string }; Body: { minutes?: number } }>(
    "/api/alerts/:id/mute",
    async (req, reply) => {
      if (!assertAdmin(req, cfg)) return reply.code(401).send({ error: "unauthorized" });
      const minutes = Math.min(24 * 60, Math.max(5, Number(req.body?.minutes ?? 30)));
      const until = Date.now() + minutes * 60 * 1000;
      muteAlert(db, req.params.id, until);
      return { ok: true, muteUntil: until };
    },
  );
}
