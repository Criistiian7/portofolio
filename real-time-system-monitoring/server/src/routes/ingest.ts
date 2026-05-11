import type { FastifyInstance } from "fastify";
import type { DatabaseHandle } from "../db.js";
import type { IngestBody } from "../schema/ingest.js";
import { IngestBodySchema } from "../schema/ingest.js";
import { PipelineCounters } from "../pipeline/counters.js";
import { ReplayLimiter } from "../replay/replayLimiter.js";

function bearerKey(authHeader: string | undefined, validKeys: Set<string>): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const key = authHeader.slice("Bearer ".length).trim();
  return validKeys.has(key) ? key : null;
}

function claimIdempotencyAndEnqueue(db: DatabaseHandle, idem: string, enqueue: () => void): "ok" | "duplicate" {
  try {
    const tx = db.transaction(() => {
      db.prepare(`INSERT INTO idempotency_keys (dedupe_key, created_at) VALUES (?, ?)`).run(idem, Date.now());
      enqueue();
    });
    tx();
    return "ok";
  } catch {
    return "duplicate";
  }
}

function enqueuePayload(db: DatabaseHandle, body: IngestBody, idem: string | null) {
  const envelope = JSON.stringify({ body, receivedAt: Date.now() });
  db.prepare(
    `INSERT INTO ingest_queue (payload, idempotency_key, created_at) VALUES (@payload, @idem, @ts)`,
  ).run({
    payload: envelope,
    idem,
    ts: Date.now(),
  });
}

export async function registerIngestRoutes(
  app: FastifyInstance,
  deps: { db: DatabaseHandle; replayLimiter: ReplayLimiter },
) {
  const { db, replayLimiter } = deps;

  app.post<{ Body: unknown }>("/v1/ingest", async (req, reply) => {
    const apiKey = bearerKey(req.headers.authorization, cfg.ingestApiKeys);
    if (!apiKey) {
      PipelineCounters.ingestRejected(db, 1);
      return reply.code(401).send({ error: "unauthorized", detail: "missing_or_invalid_bearer_token" });
    }

    const parsed = IngestBodySchema.safeParse(req.body);
    if (!parsed.success) {
      PipelineCounters.ingestRejected(db, 1);
      return reply.code(400).send({ error: "validation_failed", issues: parsed.error.flatten() });
    }

    const body = parsed.data;

    if (body.source === "synthetic_replay") {
      const lim = replayLimiter.tryConsume(apiKey, body.events.length);
      if (!lim.ok) {
        PipelineCounters.ingestRejected(db, body.events.length);
        return reply.code(429).send({ error: "replay_limited", reason: lim.reason });
      }
    }

    const idem = req.headers["idempotency-key"];
    if (typeof idem === "string" && idem.length > 0) {
      const claimed = claimIdempotencyAndEnqueue(db, idem, () => enqueuePayload(db, body, idem));
      if (claimed === "duplicate") {
        return reply.code(200).send({ accepted: false, duplicate: true });
      }
    } else {
      enqueuePayload(db, body, null);
    }

    PipelineCounters.ingestAccepted(db, body.events.length);
    PipelineCounters.ingestQueued(db, 1);

    return reply.code(202).send({ accepted: true, queued: true, schemaVersion: body.schemaVersion });
  });
}
