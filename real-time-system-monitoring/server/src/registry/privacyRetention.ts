/**
 * Portfolio posture: what we store, how long, and what clients should strip.
 * MVP enforces TTL deletes on a schedule; identifiers in tags are discouraged.
 */
export const PII_POLICY = {
  stripByDefault: ["email", "user_id", "name", "phone", "ip_full"],
  allowedTagPrefixes: ["route", "region", "browser", "sdk", "release"],
  samplingNote:
    "Clients should sample high-cardinality RUM; server caps payload size and rate.",
} as const;

export type RetentionPolicy = {
  metricsDays: number;
  logsDays: number;
  exportNote: string;
};

export function retentionPolicyFromEnv(metricsDays: number, logsDays: number): RetentionPolicy {
  return {
    metricsDays,
    logsDays,
    exportNote:
      "MVP stores hashed API key id only for replay quotas; raw events use client-provided tags — export/delete is delete-by-hour-bucket job + key rotation.",
  };
}
