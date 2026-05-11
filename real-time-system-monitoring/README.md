# Portfolio SRE Copilot (real-time-system-monitoring)

Ship-fast MVP for a web-focused observability copilot: **authenticated ingest**, **schema-versioned** JSON, **SyntheticReplay** caps, **5m rollups** in SQLite, **rules + EWMA**, **ETA windows** from a piecewise linear forecast, **Incident Mode** UI, **alert lifecycle**, and **evaluation** snippets.

## Layout

- `server` — Fastify API (`/v1/ingest`, `/api/*` dashboard JSON).
- `web` — Vite + React incident dashboard (proxies `/api` and `/v1` to `localhost:4000`).
- `client/beacon.ts` — thin browser beacon you can copy into apps like `task-manager` or `typing-speed-app-react`.
- `tools/synthetic-replay.ts` — labeled replay driver through the real ingest path.

## Local workflow

1. Install dependencies from this folder: `npm install`
2. Terminal A — `npm run dev:server`
3. Terminal B — `npm run dev:web`
4. Open the printed Vite URL, paste the ingest bearer (`INGEST_API_KEYS` default includes `dev-local-ingest-key-change-me`) to mutate alerts.

Environment highlights:

- `INGEST_API_KEYS` — comma-separated bearer tokens.
- `SYNTHETIC_REPLAY_MAX_QPS`, `SYNTHETIC_REPLAY_DAILY_CAP`, `REPLAY_KILL_SWITCH` — replay guardrails.
- `RETENTION_METRICS_DAYS`, `RETENTION_LOGS_DAYS` — TTL deletes (hourly job).

## Honest boundaries

- MVP uses **processing-time** 5m windows with idempotent rollups; **event-time watermarks** belong to the scale phase (Kafka/Flink narrative), not this codebase.
- Multivariate scoring is a **deliberately simple** aggregate z-style score on headline metrics — a stand-in for periodic batch Isolation Forest on a low-dimensional vector.
- Forecasts are **suggest-only**; trust comes from the evaluation page + your own traffic volume.
