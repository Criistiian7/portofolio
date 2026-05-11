import type { DatabaseHandle } from "../db.js";
import type { HeadlineMetricKey } from "../registry/headlineMetrics.js";

const EWMA_ALPHA = 0.3;

export function updateEwmaForBucket(
  db: DatabaseHandle,
  metricKey: HeadlineMetricKey,
  bucketStart: number,
  observation: number,
): number {
  const row = db
    .prepare(`SELECT ewma, updated_bucket FROM ewma_state WHERE metric_key = ?`)
    .get(metricKey) as { ewma: number; updated_bucket: number } | undefined;

  const nextEwma = row ? EWMA_ALPHA * observation + (1 - EWMA_ALPHA) * row.ewma : observation;

  db.prepare(
    `
    INSERT INTO ewma_state (metric_key, ewma, updated_bucket)
    VALUES (@metric_key, @ewma, @updated_bucket)
    ON CONFLICT(metric_key) DO UPDATE SET
      ewma = excluded.ewma,
      updated_bucket = excluded.updated_bucket
  `,
  ).run({ metric_key: metricKey, ewma: nextEwma, updated_bucket: bucketStart });

  return nextEwma;
}

export function readEwma(db: DatabaseHandle, metricKey: HeadlineMetricKey): number | null {
  const row = db.prepare(`SELECT ewma FROM ewma_state WHERE metric_key = ?`).get(metricKey) as
    | { ewma: number }
    | undefined;
  return row?.ewma ?? null;
}
