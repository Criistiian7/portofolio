/**
 * Headline SLIs / metrics the copilot tracks (MVP scope).
 * Values are roll-up keys produced by the pipeline from raw samples.
 */
export const HEADLINE_METRIC_KEYS = [
  "error_rate_5xx",
  "p95_latency_ms",
  "web_vital_lcp_ms",
  "quota_429_share",
  "success_rate",
] as const;

export type HeadlineMetricKey = (typeof HEADLINE_METRIC_KEYS)[number];

export type MetricDefinition = {
  key: HeadlineMetricKey;
  displayName: string;
  unit: "ratio" | "ms" | "percent";
  /** SLO direction: lower is better for error-ish metrics. */
  direction: "lower_better" | "higher_better";
  /** Soft limit used for rules + ETA narratives (not a contractual SLA by itself). */
  warnThreshold: number;
  criticalThreshold: number;
};

export const METRIC_REGISTRY: Record<HeadlineMetricKey, MetricDefinition> = {
  error_rate_5xx: {
    key: "error_rate_5xx",
    displayName: "5xx error rate",
    unit: "ratio",
    direction: "lower_better",
    warnThreshold: 0.005,
    criticalThreshold: 0.02,
  },
  p95_latency_ms: {
    key: "p95_latency_ms",
    displayName: "p95 latency",
    unit: "ms",
    direction: "lower_better",
    warnThreshold: 800,
    criticalThreshold: 2000,
  },
  web_vital_lcp_ms: {
    key: "web_vital_lcp_ms",
    displayName: "LCP (p75 proxy)",
    unit: "ms",
    direction: "lower_better",
    warnThreshold: 2500,
    criticalThreshold: 4000,
  },
  quota_429_share: {
    key: "quota_429_share",
    displayName: "429 share",
    unit: "ratio",
    direction: "lower_better",
    warnThreshold: 0.01,
    criticalThreshold: 0.05,
  },
  success_rate: {
    key: "success_rate",
    displayName: "Success rate",
    unit: "ratio",
    direction: "higher_better",
    warnThreshold: 0.995,
    criticalThreshold: 0.99,
  },
};
