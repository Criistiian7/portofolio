import type { DatabaseHandle } from "../db.js";
import type { AppConfig } from "../config.js";

const FIVE_MIN = 5 * 60 * 1000;

export function purgeExpired(db: DatabaseHandle, cfg: AppConfig, now = Date.now()) {
  const cutoffHour = Math.floor(now / 3600000) - cfg.retentionLogsDays * 24;
  db.prepare(`DELETE FROM raw_events WHERE hour_bucket < ?`).run(cutoffHour);

  const cutoffRollup = now - cfg.retentionMetricsDays * 24 * 60 * 60 * 1000;
  const rollupBucket = Math.floor(cutoffRollup / FIVE_MIN) * FIVE_MIN;
  db.prepare(`DELETE FROM rollup_5m WHERE bucket_start < ?`).run(rollupBucket);
  db.prepare(`DELETE FROM multivariate_scores WHERE bucket_start < ?`).run(rollupBucket);
}
