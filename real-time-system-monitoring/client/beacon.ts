/**
 * Thin browser beacon for Web Vitals + errors + release dimensions.
 * Point this at your SRE Copilot ingest endpoint (same origin or CORS-enabled).
 */
export type BeaconConfig = {
  ingestUrl: string;
  /** Must match server INGEST_API_KEYS */
  bearerToken: string;
  /** Never send PII in tags — prefer coarse route/region/browser labels. */
  defaultRelease?: {
    commit?: string;
    buildId?: string;
    version?: string;
    environment?: string;
    service?: string;
    region?: string;
  };
};

export type BeaconSample = {
  ts: number;
  metricKey:
    | "error_rate_5xx"
    | "p95_latency_ms"
    | "web_vital_lcp_ms"
    | "quota_429_share"
    | "success_rate";
  value: number;
  count?: number;
  route?: string;
  region?: string;
};

async function postIngest(cfg: BeaconConfig, source: "live" | "synthetic_replay", events: unknown[]) {
  const res = await fetch(cfg.ingestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.bearerToken}`,
    },
    body: JSON.stringify({
      schemaVersion: "1",
      source,
      release: cfg.defaultRelease,
      events,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ingest_failed:${res.status}:${text}`);
  }
  return res.json() as Promise<unknown>;
}

export async function sendSamples(cfg: BeaconConfig, samples: BeaconSample[]) {
  return postIngest(
    cfg,
    "live",
    samples.map((s) => ({ type: "sample", ...s })),
  );
}

export async function sendDeployMarker(
  cfg: BeaconConfig,
  release: {
    commit?: string;
    buildId?: string;
    version?: string;
    environment?: string;
    service?: string;
    region?: string;
  },
  note?: string,
) {
  return postIngest(cfg, "live", [
    {
      type: "deploy",
      ts: Date.now(),
      release,
      note,
    },
  ]);
}
