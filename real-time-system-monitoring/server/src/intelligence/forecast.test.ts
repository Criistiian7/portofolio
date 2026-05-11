import { describe, expect, it } from "vitest";
import { forecastThresholdCrossing, maeOnHoldout } from "./forecast.js";

const STEP = 5 * 60 * 1000;

describe("forecastThresholdCrossing", () => {
  it("estimates an ETA window for a rising lower-is-better metric", () => {
    const base = Date.now();
    const pts = [0.001, 0.0014, 0.0019, 0.0024, 0.003].map((v, i) => ({
      bucketStart: base + i * STEP,
      value: v,
    }));

    const fc = forecastThresholdCrossing("error_rate_5xx", pts, "test-model");
    expect(fc.direction).toBe("approaching_from_below");
    expect(fc.etaMinMs).toBeTypeOf("number");
    expect(fc.etaMaxMs).toBeTypeOf("number");
    if (fc.etaMinMs && fc.etaMaxMs) {
      expect(fc.etaMaxMs).toBeGreaterThanOrEqual(fc.etaMinMs);
    }
  });
});

describe("maeOnHoldout", () => {
  it("returns finite error for simple linear series", () => {
    const series = [1, 2, 3, 4, 5, 6, 7, 8];
    const mae = maeOnHoldout(series, 0.25);
    expect(Number.isFinite(mae)).toBe(true);
  });
});
