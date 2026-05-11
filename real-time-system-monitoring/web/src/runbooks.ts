export type Runbook = { metricKey: string; title: string; steps: string[]; links: { label: string; href: string }[] };

export const RUNBOOKS: Runbook[] = [
  {
    metricKey: "error_rate_5xx",
    title: "5xx spike",
    steps: [
      "Confirm SyntheticReplay vs live traffic in alert metadata.",
      "Open deploy markers in the incident window; correlate version/region.",
      "Check saturation signals (429 share, p95) for upstream dependency pressure.",
    ],
    links: [
      { label: "SRE book — incident response", href: "https://sre.google/sre-book/managing-load/" },
    ],
  },
  {
    metricKey: "p95_latency_ms",
    title: "Latency regression",
    steps: [
      "Segment by route/region tags if present in rollups.",
      "Compare top movers across the last two 5m buckets.",
      "Validate client vs server attribution before deep-diving traces.",
    ],
    links: [{ label: "Web Vitals — LCP", href: "https://web.dev/articles/lcp" }],
  },
  {
    metricKey: "quota_429_share",
    title: "Quota / throttling pressure",
    steps: [
      "Identify which dependency emits 429 (gateway vs vendor).",
      "Check success_rate coupling — partial failures often precede hard errors.",
      "Consider backoff + shed load; document blast radius using session/sample language in postmortem.",
    ],
    links: [{ label: "AWS throttling patterns", href: "https://docs.aws.amazon.com/general/latest/gr/api-retries.html" }],
  },
  {
    metricKey: "web_vital_lcp_ms",
    title: "LCP regression (RUM proxy)",
    steps: [
      "Treat as client-perf hypothesis: assets, fonts, SSR delays.",
      "Cross-check with p95 API latency to separate network vs server.",
    ],
    links: [{ label: "Optimize LCP", href: "https://web.dev/articles/optimize-lcp" }],
  },
  {
    metricKey: "success_rate",
    title: "Success rate dip",
    steps: [
      "Invert mentally vs error_rate: confirm which endpoint class drives the drop.",
      "Use forecast strip only as suggest-only input until evaluation page looks healthy.",
    ],
    links: [{ label: "Google SLOs", href: "https://sre.google/workbook/implementing-slos/" }],
  },
];

export function runbookFor(metricKey: string): Runbook | undefined {
  return RUNBOOKS.find((r) => r.metricKey === metricKey);
}
