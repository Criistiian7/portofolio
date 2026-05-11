import crypto from "node:crypto";
import type { DatabaseHandle } from "../db.js";
import { METRIC_REGISTRY, type HeadlineMetricKey } from "../registry/headlineMetrics.js";

export type RuleObservation = {
  metricKey: HeadlineMetricKey;
  bucketStart: number;
  observation: number;
  source: "live" | "synthetic_replay";
};

function severityFor(metricKey: HeadlineMetricKey, value: number): "warn" | "critical" | null {
  const def = METRIC_REGISTRY[metricKey];
  if (def.direction === "lower_better") {
    if (value >= def.criticalThreshold) return "critical";
    if (value >= def.warnThreshold) return "warn";
    return null;
  }
  if (value <= def.criticalThreshold) return "critical";
  if (value <= def.warnThreshold) return "warn";
  return null;
}

export function evaluateRulesForObservation(db: DatabaseHandle, obs: RuleObservation): void {
  const sev = severityFor(obs.metricKey, obs.observation);
  if (!sev) return;

  const dedupeKey = `rule:${obs.metricKey}:${obs.bucketStart}`;
  const now = Date.now();

  const active = db
    .prepare(
      `SELECT id, mute_until FROM alerts WHERE dedupe_key = ? AND state IN ('firing', 'acknowledged')`,
    )
    .get(dedupeKey) as { id: string; mute_until: number | null } | undefined;

  if (active?.mute_until && active.mute_until > now) {
    return;
  }
  if (active) {
    return;
  }

  const title =
    sev === "critical"
      ? `${obs.metricKey} critical threshold`
      : `${obs.metricKey} warning threshold`;

  const id = crypto.randomUUID();
  const metadata = JSON.stringify({
    metricKey: obs.metricKey,
    bucketStart: obs.bucketStart,
    source: obs.source,
    observation: obs.observation,
    mode: "suggest_only",
  });

  db.prepare(
    `
    INSERT INTO alerts (id, dedupe_key, title, severity, state, fired_at, metadata_json)
    VALUES (@id, @dedupe_key, @title, @severity, 'firing', @fired_at, @metadata_json)
  `,
  ).run({
    id,
    dedupe_key: dedupeKey,
    title,
    severity: sev,
    fired_at: now,
    metadata_json: metadata,
  });
}
