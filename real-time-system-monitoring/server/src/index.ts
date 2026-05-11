import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { loadConfig } from "./config.js";
import { openDatabase } from "./db.js";
import { ReplayLimiter } from "./replay/replayLimiter.js";
import { registerIngestRoutes } from "./routes/ingest.js";
import { registerDashboardApi } from "./routes/dashboardApi.js";
import { startPipelineWorker } from "./worker/pipelineWorker.js";
import { purgeExpired } from "./retention/purge.js";

const cfg = loadConfig();
const db = openDatabase(cfg.databasePath);
const replayLimiter = new ReplayLimiter(db, cfg);

const app = Fastify({
  logger: true,
  bodyLimit: cfg.maxIngestBodyBytes,
});

await app.register(cors, {
  origin: cfg.corsOrigins.includes("*") ? true : cfg.corsOrigins,
});

await app.register(rateLimit, {
  global: true,
  max: 600,
  timeWindow: "1 minute",
});

await registerIngestRoutes(app, { db, replayLimiter });
await registerDashboardApi(app, { db, cfg });

const stopWorker = startPipelineWorker(db, cfg, 300);
const retentionTimer = setInterval(() => purgeExpired(db, cfg), 60 * 60 * 1000);

const close = async () => {
  clearInterval(retentionTimer);
  stopWorker();
  await app.close();
  db.close();
};

process.on("SIGINT", () => {
  void close().then(() => process.exit(0));
});
process.on("SIGTERM", () => {
  void close().then(() => process.exit(0));
});

await app.listen({ port: cfg.port, host: cfg.host });
app.log.info(`SRE Copilot ingest listening on ${cfg.host}:${cfg.port}`);
