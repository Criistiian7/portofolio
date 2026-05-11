import type { DatabaseHandle } from "../db.js";
import type { AppConfig } from "../config.js";
import type { IngestBody } from "../schema/ingest.js";
import { processIngestBatch, type QueuedIngest } from "./processBatch.js";
import { PipelineCounters } from "../pipeline/counters.js";

export function startPipelineWorker(db: DatabaseHandle, cfg: AppConfig, intervalMs = 250) {
  const timer = setInterval(() => {
    try {
      drainOnce(db, cfg);
    } catch {
      PipelineCounters.workerError(db);
    }
  }, intervalMs);
  return () => clearInterval(timer);
}

function drainOnce(db: DatabaseHandle, cfg: AppConfig) {
  const rows = db
    .prepare(
      `SELECT id, payload FROM ingest_queue WHERE processed_at IS NULL ORDER BY id ASC LIMIT 25`,
    )
    .all() as { id: number; payload: string }[];

  if (rows.length === 0) return;

  const mark = db.prepare(`UPDATE ingest_queue SET processed_at = @ts WHERE id = @id`);

  for (const row of rows) {
    let parsed: QueuedIngest;
    try {
      const envelope = JSON.parse(row.payload) as { body: IngestBody; receivedAt: number };
      parsed = { body: envelope.body, receivedAt: envelope.receivedAt };
    } catch {
      PipelineCounters.workerError(db);
      mark.run({ ts: Date.now(), id: row.id });
      continue;
    }

    try {
      processIngestBatch(db, cfg, parsed);
      PipelineCounters.workerProcessed(db, 1);
    } catch {
      PipelineCounters.workerError(db);
    } finally {
      mark.run({ ts: Date.now(), id: row.id });
    }
  }
}
