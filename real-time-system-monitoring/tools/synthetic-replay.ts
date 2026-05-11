/**
 * SyntheticReplay driver — exercises the same `/v1/ingest` path as production beacons.
 * Caps are enforced server-side (QPS token bucket + daily totals + optional kill switch).
 *
 * Usage (after installing workspace deps):
 *   INGEST_URL=http://127.0.0.1:4000/v1/ingest INGEST_KEY=dev-local-ingest-key-change-me npx tsx tools/synthetic-replay.ts
 */
const url = process.env.INGEST_URL ?? "http://127.0.0.1:4000/v1/ingest";
const key = process.env.INGEST_KEY ?? "dev-local-ingest-key-change-me";
const batches = Number(process.env.REPLAY_BATCHES ?? 5);
const eventsPerBatch = Number(process.env.REPLAY_EVENTS_PER_BATCH ?? 40);

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function sendBatch(i: number) {
  const now = Date.now();
  const events = Array.from({ length: eventsPerBatch }, (_, idx) => ({
    type: "sample" as const,
    ts: now + idx,
    metricKey: "error_rate_5xx" as const,
    value: 0.001 + (i + idx) * 1e-5,
    count: 1,
    route: "/synthetic/replay",
    region: "replay-east",
  }));

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      "Idempotency-Key": `synthetic-replay-${now}-${i}`,
    },
    body: JSON.stringify({
      schemaVersion: "1",
      source: "synthetic_replay",
      release: {
        version: "synthetic-replay-tool",
        environment: "development",
        service: "replay-driver",
      },
      events,
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`ingest_failed ${res.status}: ${text}`);
  }
  process.stdout.write(`batch ${i + 1}/${batches} ${text}\n`);
}

async function main() {
  for (let i = 0; i < batches; i++) {
    await sendBatch(i);
    await sleep(250);
  }
}

await main();
