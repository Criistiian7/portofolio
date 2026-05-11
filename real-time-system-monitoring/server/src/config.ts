export type AppConfig = {
  port: number;
  host: string;
  databasePath: string;
  ingestApiKeys: Set<string>;
  maxIngestBodyBytes: number;
  /** Comma-separated origins for CORS; * allows all (dev only). */
  corsOrigins: string[];
  syntheticReplayMaxQps: number;
  syntheticReplayDailyCap: number;
  replayKillSwitch: boolean;
  retentionMetricsDays: number;
  retentionLogsDays: number;
  forecastModelVersion: string;
  multivariateModelVersion: string;
};

function parseCsvSet(value: string | undefined, fallback: string): Set<string> {
  const raw = (value ?? fallback).split(",").map((s) => s.trim()).filter(Boolean);
  return new Set(raw);
}

export function loadConfig(): AppConfig {
  const ingestApiKeys = parseCsvSet(
    process.env.INGEST_API_KEYS,
    "dev-local-ingest-key-change-me",
  );
  return {
    port: Number(process.env.PORT ?? 4000),
    host: process.env.HOST ?? "0.0.0.0",
    databasePath: process.env.DATABASE_PATH ?? "./data/sre-copilot.db",
    ingestApiKeys,
    maxIngestBodyBytes: Number(process.env.MAX_INGEST_BODY_BYTES ?? 256_000),
    corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:5173").split(",").map((s) => s.trim()),
    syntheticReplayMaxQps: Number(process.env.SYNTHETIC_REPLAY_MAX_QPS ?? 50),
    syntheticReplayDailyCap: Number(process.env.SYNTHETIC_REPLAY_DAILY_CAP ?? 500_000),
    replayKillSwitch: (process.env.REPLAY_KILL_SWITCH ?? "").toLowerCase() === "true",
    retentionMetricsDays: Number(process.env.RETENTION_METRICS_DAYS ?? 30),
    retentionLogsDays: Number(process.env.RETENTION_LOGS_DAYS ?? 14),
    forecastModelVersion: process.env.FORECAST_MODEL_VERSION ?? "piecewise-linear-v1",
    multivariateModelVersion: process.env.MULTIVARIATE_MODEL_VERSION ?? "aggregate-zscore-v1",
  };
}
