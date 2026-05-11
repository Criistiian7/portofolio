import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

export type DatabaseHandle = Database.Database;

export function openDatabase(dbPath: string): DatabaseHandle {
  if (dbPath !== ":memory:") {
    const dir = path.dirname(dbPath);
    fs.mkdirSync(dir, { recursive: true });
  }
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  migrate(db);
  return db;
}

function migrate(db: DatabaseHandle) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS ingest_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      payload TEXT NOT NULL,
      idempotency_key TEXT UNIQUE,
      created_at INTEGER NOT NULL,
      processed_at INTEGER
    );

    CREATE INDEX IF NOT EXISTS idx_ingest_queue_unprocessed ON ingest_queue(created_at) WHERE processed_at IS NULL;

    CREATE TABLE IF NOT EXISTS raw_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hour_bucket INTEGER NOT NULL,
      received_at INTEGER NOT NULL,
      source TEXT NOT NULL,
      schema_version TEXT NOT NULL,
      event_type TEXT NOT NULL,
      payload_json TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_raw_events_hour ON raw_events(hour_bucket);

    CREATE TABLE IF NOT EXISTS rollup_5m (
      bucket_start INTEGER NOT NULL,
      metric_key TEXT NOT NULL,
      sample_count INTEGER NOT NULL,
      sum_values REAL NOT NULL,
      min_v REAL,
      max_v REAL,
      PRIMARY KEY (bucket_start, metric_key)
    );

    CREATE TABLE IF NOT EXISTS deploy_markers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts INTEGER NOT NULL,
      commit_hash TEXT,
      build_id TEXT,
      version TEXT,
      environment TEXT,
      service TEXT,
      region TEXT,
      note TEXT,
      source TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_deploy_ts ON deploy_markers(ts);

    CREATE TABLE IF NOT EXISTS pipeline_counters (
      name TEXT PRIMARY KEY,
      value INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS idempotency_keys (
      dedupe_key TEXT PRIMARY KEY,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS replay_usage (
      day_key TEXT NOT NULL,
      api_key_id TEXT NOT NULL,
      accepted_events INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (day_key, api_key_id)
    );

    CREATE TABLE IF NOT EXISTS ewma_state (
      metric_key TEXT PRIMARY KEY,
      ewma REAL NOT NULL,
      updated_bucket INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS multivariate_scores (
      bucket_start INTEGER PRIMARY KEY,
      score REAL NOT NULL,
      model_version TEXT NOT NULL,
      computed_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      dedupe_key TEXT NOT NULL,
      title TEXT NOT NULL,
      severity TEXT NOT NULL,
      state TEXT NOT NULL,
      fired_at INTEGER NOT NULL,
      acknowledged_at INTEGER,
      resolved_at INTEGER,
      mute_until INTEGER,
      metadata_json TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_alerts_state ON alerts(state);
    CREATE INDEX IF NOT EXISTS idx_alerts_dedupe_active ON alerts(dedupe_key, state);
  `);

  const seeds = [
    ["ingest_accepted", 0],
    ["ingest_rejected", 0],
    ["ingest_queued", 0],
    ["worker_processed_batches", 0],
    ["worker_errors", 0],
    ["rollup_updates", 0],
  ] as const;
  const insertCounter = db.prepare(
    `INSERT OR IGNORE INTO pipeline_counters (name, value) VALUES (@name, @value)`,
  );
  for (const [name, value] of seeds) {
    insertCounter.run({ name, value });
  }
}
