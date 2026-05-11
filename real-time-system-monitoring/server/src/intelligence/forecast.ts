import { METRIC_REGISTRY, type HeadlineMetricKey } from "../registry/headlineMetrics.js";

export type RollupPoint = { bucketStart: number; value: number };

/** Ordinary least squares on indices 0..n-1 */
export function fitLinear(series: number[]): { intercept: number; slope: number } {
  const n = series.length;
  if (n < 2) return { intercept: series[0] ?? 0, slope: 0 };
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  for (let i = 0; i < n; i++) {
    const x = i;
    const y = series[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }
  const denom = n * sumXX - sumX * sumX;
  if (Math.abs(denom) < 1e-12) {
    return { intercept: sumY / n, slope: 0 };
  }
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  return { intercept, slope };
}

export function maeOnHoldout(series: number[], holdoutRatio = 0.2): number {
  if (series.length < 5) return Number.POSITIVE_INFINITY;
  const hold = Math.max(2, Math.floor(series.length * holdoutRatio));
  const train = series.slice(0, series.length - hold);
  const test = series.slice(series.length - hold);
  const { intercept, slope } = fitLinear(train);
  let err = 0;
  for (let i = 0; i < test.length; i++) {
    const x = train.length - 1 + 1 + i;
    const pred = intercept + slope * x;
    err += Math.abs(pred - test[i]);
  }
  return err / test.length;
}

const FIVE_MIN = 5 * 60 * 1000;

export type ThresholdForecast = {
  metricKey: HeadlineMetricKey;
  threshold: number;
  direction: "approaching_from_below" | "approaching_from_above" | "not_forecastable";
  /** Earliest plausible crossing (epoch ms) if trend continues. */
  etaMinMs: number | null;
  /** Latest plausible crossing (epoch ms) based on MAE-derived slack. */
  etaMaxMs: number | null;
  modelVersion: string;
  confidenceNote: string;
  maeHoldout: number | null;
};

/**
 * Piecewise-linear forecast for threshold crossing with an ETA window.
 * Defaults per plan: interpretable linear trend; confidence from holdout MAE slack.
 */
export function forecastThresholdCrossing(
  metricKey: HeadlineMetricKey,
  points: RollupPoint[],
  modelVersion: string,
): ThresholdForecast {
  const def = METRIC_REGISTRY[metricKey];
  const threshold = def.warnThreshold;
  const series = points.map((p) => p.value);
  if (series.length < 4 || points.length !== series.length) {
    return {
      metricKey,
      threshold,
      direction: "not_forecastable",
      etaMinMs: null,
      etaMaxMs: null,
      modelVersion,
      confidenceNote: "insufficient_history",
      maeHoldout: null,
    };
  }

  const mae = maeOnHoldout(series, 0.25);
  const { intercept, slope } = fitLinear(series);
  const lastIdx = series.length - 1;
  const lastT = points[lastIdx].bucketStart;
  const lastY = series[lastIdx];

  const slackMs = Number.isFinite(mae) ? Math.min(6 * FIVE_MIN, mae * 10 * FIVE_MIN) : 3 * FIVE_MIN;

  if (def.direction === "lower_better") {
    if (Math.abs(slope) < 1e-12) {
      return {
        metricKey,
        threshold,
        direction: "not_forecastable",
        etaMinMs: null,
        etaMaxMs: null,
        modelVersion,
        confidenceNote: "flat_trend",
        maeHoldout: Number.isFinite(mae) ? mae : null,
      };
    }
    const crossingIndex = (threshold - intercept) / slope;
    if (slope <= 0 || crossingIndex <= lastIdx) {
      return {
        metricKey,
        threshold,
        direction: slope > 0 && lastY < threshold ? "approaching_from_below" : "not_forecastable",
        etaMinMs: null,
        etaMaxMs: null,
        modelVersion,
        confidenceNote: slope <= 0 ? "improving_or_flat" : "already_breached_or_near",
        maeHoldout: Number.isFinite(mae) ? mae : null,
      };
    }
    const deltaSteps = crossingIndex - lastIdx;
    const center = lastT + deltaSteps * FIVE_MIN;
    return {
      metricKey,
      threshold,
      direction: "approaching_from_below",
      etaMinMs: Math.round(center - slackMs),
      etaMaxMs: Math.round(center + slackMs),
      modelVersion,
      confidenceNote: "window_from_holdout_mae",
      maeHoldout: Number.isFinite(mae) ? mae : null,
    };
  }

  if (Math.abs(slope) < 1e-12) {
    return {
      metricKey,
      threshold,
      direction: "not_forecastable",
      etaMinMs: null,
      etaMaxMs: null,
      modelVersion,
      confidenceNote: "flat_trend",
      maeHoldout: Number.isFinite(mae) ? mae : null,
    };
  }

  const crossingIndex = (threshold - intercept) / slope;
  if (slope >= 0 || crossingIndex <= lastIdx) {
    return {
      metricKey,
      threshold,
      direction: slope < 0 && lastY > threshold ? "approaching_from_above" : "not_forecastable",
      etaMinMs: null,
      etaMaxMs: null,
      modelVersion,
      confidenceNote: slope >= 0 ? "healthy_trend" : "already_breached_or_near",
      maeHoldout: Number.isFinite(mae) ? mae : null,
    };
  }
  const deltaSteps = crossingIndex - lastIdx;
  const center = lastT + deltaSteps * FIVE_MIN;
  return {
    metricKey,
    threshold,
    direction: "approaching_from_above",
    etaMinMs: Math.round(center - slackMs),
    etaMaxMs: Math.round(center + slackMs),
    modelVersion,
    confidenceNote: "window_from_holdout_mae",
    maeHoldout: Number.isFinite(mae) ? mae : null,
  };
}
