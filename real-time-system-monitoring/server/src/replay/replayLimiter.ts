import type { DatabaseHandle } from "../db.js";
import type { AppConfig } from "../config.js";
import { apiKeyId, utcDayKey } from "./apiKeyId.js";

type BucketState = { tokens: number; lastRefillMs: number };

/**
 * In-memory QPS token bucket + persisted daily event cap for SyntheticReplay.
 */
export class ReplayLimiter {
  private buckets = new Map<string, BucketState>();

  constructor(
    private readonly db: DatabaseHandle,
    private readonly cfg: Pick<AppConfig, "syntheticReplayMaxQps" | "syntheticReplayDailyCap" | "replayKillSwitch">,
  ) {}

  tryConsume(apiKey: string, eventCount: number, now = Date.now()): { ok: true } | { ok: false; reason: string } {
    if (this.cfg.replayKillSwitch) {
      return { ok: false, reason: "replay_kill_switch_enabled" };
    }

    const keyId = apiKeyId(apiKey);
    const day = utcDayKey(now);

    const row = this.db
      .prepare(
        `SELECT accepted_events FROM replay_usage WHERE day_key = @day AND api_key_id = @kid`,
      )
      .get({ day, kid: keyId }) as { accepted_events: number } | undefined;

    const used = row?.accepted_events ?? 0;
    if (used + eventCount > this.cfg.syntheticReplayDailyCap) {
      return { ok: false, reason: "synthetic_daily_cap_exceeded" };
    }

    const maxQps = this.cfg.syntheticReplayMaxQps;
    let st = this.buckets.get(keyId);
    if (!st) {
      st = { tokens: maxQps, lastRefillMs: now };
      this.buckets.set(keyId, st);
    }

    const elapsed = (now - st.lastRefillMs) / 1000;
    st.tokens = Math.min(maxQps, st.tokens + elapsed * maxQps);
    st.lastRefillMs = now;

    if (st.tokens < eventCount) {
      return { ok: false, reason: "synthetic_qps_throttled" };
    }

    st.tokens -= eventCount;
    this.buckets.set(keyId, st);

    this.db
      .prepare(
        `
        INSERT INTO replay_usage (day_key, api_key_id, accepted_events)
        VALUES (@day, @kid, @n)
        ON CONFLICT(day_key, api_key_id) DO UPDATE SET
          accepted_events = accepted_events + excluded.accepted_events
      `,
      )
      .run({ day, kid: keyId, n: eventCount });

    return { ok: true };
  }
}
