import type { DatabaseHandle } from "../db.js";
import type { HeadlineMetricKey } from "../registry/headlineMetrics.js";

export type RollupMergeInput = {
  bucketStart: number;
  metricKey: HeadlineMetricKey;
  weightedSum: number;
  sampleCount: number;
  minV: number;
  maxV: number;
};

/**
 * Applies deltas into rollup_5m. ON CONFLICT merges counts and extrema.
 */
export function mergeRollupBatch(db: DatabaseHandle, items: RollupMergeInput[]): number {
  if (items.length === 0) return 0;
  const upsert = db.prepare(`
    INSERT INTO rollup_5m (bucket_start, metric_key, sample_count, sum_values, min_v, max_v)
    VALUES (@bucket_start, @metric_key, @sample_count, @sum_values, @min_v, @max_v)
    ON CONFLICT(bucket_start, metric_key) DO UPDATE SET
      sample_count = rollup_5m.sample_count + excluded.sample_count,
      sum_values = rollup_5m.sum_values + excluded.sum_values,
      min_v = CASE
        WHEN rollup_5m.min_v IS NULL THEN excluded.min_v
        ELSE MIN(rollup_5m.min_v, excluded.min_v)
      END,
      max_v = CASE
        WHEN rollup_5m.max_v IS NULL THEN excluded.max_v
        ELSE MAX(rollup_5m.max_v, excluded.max_v)
      END
  `);

  for (const row of items) {
    upsert.run({
      bucket_start: row.bucketStart,
      metric_key: row.metricKey,
      sample_count: row.sampleCount,
      sum_values: row.weightedSum,
      min_v: row.minV,
      max_v: row.maxV,
    });
  }
  return items.length;
}
