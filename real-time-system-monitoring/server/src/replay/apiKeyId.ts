import crypto from "node:crypto";

export function apiKeyId(apiKey: string): string {
  return crypto.createHash("sha256").update(apiKey, "utf8").digest("hex").slice(0, 16);
}

export function utcDayKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}
