import type { DatabaseHandle } from "../db.js";
import type { AppConfig } from "../config.js";
import { HEADLINE_METRIC_KEYS } from "../registry/headlineMetrics.js";

const FIVE_MIN = 5 * 60 * 1000;

/**
 * Lightweight aggregate anomaly score (portfolio stand-in for periodic Isolation Forest).
 * Uses standardized deviations from historical means across a fixed low-dimensional vector.
 */
export function scoreMultivariateForBucket(db: DatabaseHandle, cfg: AppConfig, bucketStart: number): void {
  const values: number[] = [];
  for (const key of HEADLINE_METRIC_KEYS) {
    const row = db
      .prepare(
        `SELECT sample_count, sum_values FROM rollup_5m WHERE bucket_start = ? AND metric_key = ?`,
      )
      .get(bucketStart, key) as { sample_count: number; sum_values: number } | undefined;
    if (!row || row.sample_count === 0) {
      values.push(0);
    } else {
      values.push(row.sum_values / row.sample_count);
    }
  }

  const windowStart = bucketStart - 12 * FIVE_MIN;
  const prevRows = db
    .prepare(
      `
      SELECT metric_key, sample_count, sum_values
      FROM rollup_5m
      WHERE bucket_start < @b AND bucket_start >= @ws
    `,
    )
    .all({ b: bucketStart, ws: windowStart }) as {
    metric_key: string;
    sample_count: number;
    sum_values: number;
  }[];

  const byMetric = new Map<string, number[]>();
  for (const r of prevRows) {
    if (r.sample_count === 0) continue;
    const arr = byMetric.get(r.metric_key) ?? [];
    arr.push(r.sum_values / r.sample_count);
    byMetric.set(r.metric_key, arr);
  }

  let acc = 0;
  for (let i = 0; i < HEADLINE_METRIC_KEYS.length; i++) {
    const k = HEADLINE_METRIC_KEYS[i];
    const v = values[i];
    const hist = byMetric.get(k) ?? [];
    if (hist.length < 3) continue;
    const mean = hist.reduce((a, b) => a + b, 0) / hist.length;
    const var_ =
      hist.reduce((a, b) => a + (b - mean) * (b - mean), 0) / Math.max(1, hist.length - 1);
    const std = Math.sqrt(Math.max(var_, 1e-9));
    acc += Math.abs((v - mean) / std);
  }

  db.prepare(
    `
    INSERT INTO multivariate_scores (bucket_start, score, model_version, computed_at)
    VALUES (@bucket_start, @score, @model_version, @computed_at)
    ON CONFLICT(bucket_start) DO UPDATE SET
      score = excluded.score,
      model_version = excluded.model_version,
      computed_at = excluded.computed_at
  `,
  ).run({
    bucket_start: bucketStart,
    score: acc,
    model_version: cfg.multivariateModelVersion,
    computed_at: Date.now(),
  });
}
