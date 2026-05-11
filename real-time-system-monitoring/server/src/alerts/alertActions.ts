import type { DatabaseHandle } from "../db.js";

export function acknowledgeAlert(db: DatabaseHandle, id: string) {
  db.prepare(
    `
    UPDATE alerts
    SET state = 'acknowledged', acknowledged_at = @ts
    WHERE id = @id AND state = 'firing'
  `,
  ).run({ id, ts: Date.now() });
}

export function resolveAlert(db: DatabaseHandle, id: string) {
  db.prepare(
    `
    UPDATE alerts
    SET state = 'resolved', resolved_at = @ts
    WHERE id = @id AND state IN ('firing', 'acknowledged')
  `,
  ).run({ id, ts: Date.now() });
}

export function muteAlert(db: DatabaseHandle, id: string, muteUntilMs: number) {
  db.prepare(
    `
    UPDATE alerts
    SET mute_until = @mute
    WHERE id = @id AND state IN ('firing', 'acknowledged')
  `,
  ).run({ id, mute: muteUntilMs });
}
