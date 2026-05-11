import { describe, expect, it } from "vitest";
import { openDatabase } from "../db.js";
import { mergeRollupBatch } from "./mergeRollup.js";

describe("mergeRollupBatch", () => {
  it("merges duplicate bucket/metric idempotently", () => {
    const db = openDatabase(":memory:");
    mergeRollupBatch(db, [
      {
        bucketStart: 1_000_000,
        metricKey: "error_rate_5xx",
        weightedSum: 0.01,
        sampleCount: 2,
        minV: 0.004,
        maxV: 0.006,
      },
    ]);
    mergeRollupBatch(db, [
      {
        bucketStart: 1_000_000,
        metricKey: "error_rate_5xx",
        weightedSum: 0.02,
        sampleCount: 3,
        minV: 0.001,
        maxV: 0.009,
      },
    ]);

    const row = db
      .prepare(`SELECT sample_count, sum_values, min_v, max_v FROM rollup_5m WHERE bucket_start = ? AND metric_key = ?`)
      .get(1_000_000, "error_rate_5xx") as { sample_count: number; sum_values: number; min_v: number; max_v: number };

    expect(row.sample_count).toBe(5);
    expect(row.sum_values).toBeCloseTo(0.03, 6);
    expect(row.min_v).toBeCloseTo(0.001, 6);
    expect(row.max_v).toBeCloseTo(0.009, 6);
  });
});
