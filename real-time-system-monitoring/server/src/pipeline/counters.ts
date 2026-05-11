import type { DatabaseHandle } from "../db.js";

const inc = (db: DatabaseHandle, name: string, delta: number) => {
  db.prepare(
    `UPDATE pipeline_counters SET value = value + @delta WHERE name = @name`,
  ).run({ name, delta });
};

export const PipelineCounters = {
  ingestAccepted(db: DatabaseHandle, n: number) {
    inc(db, "ingest_accepted", n);
  },
  ingestRejected(db: DatabaseHandle, n: number) {
    inc(db, "ingest_rejected", n);
  },
  ingestQueued(db: DatabaseHandle, n: number) {
    inc(db, "ingest_queued", n);
  },
  workerProcessed(db: DatabaseHandle, n: number) {
    inc(db, "worker_processed_batches", n);
  },
  workerError(db: DatabaseHandle) {
    inc(db, "worker_errors", 1);
  },
  rollupUpdate(db: DatabaseHandle, n: number) {
    inc(db, "rollup_updates", n);
  },
};

export function readPipelineHealth(db: DatabaseHandle) {
  const rows = db
    .prepare(`SELECT name, value FROM pipeline_counters`)
    .all() as { name: string; value: number }[];
  const map = Object.fromEntries(rows.map((r) => [r.name, r.value])) as Record<string, number>;

  const queueDepth = (
    db.prepare(`SELECT COUNT(*) AS c FROM ingest_queue WHERE processed_at IS NULL`).get() as { c: number }
  ).c;

  const oldest = db
    .prepare(
      `SELECT MIN(created_at) AS m FROM ingest_queue WHERE processed_at IS NULL`,
    )
    .get() as { m: number | null };

  const now = Date.now();
  const oldestQueueAgeMs = oldest.m == null ? 0 : Math.max(0, now - oldest.m);

  return {
    counters: map,
    queueDepth,
    oldestQueueAgeMs,
  };
}
