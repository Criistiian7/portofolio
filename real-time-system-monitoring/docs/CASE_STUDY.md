# Case study — Portfolio SRE Copilot v2

## Problem framing

Web and serverless systems fail in ways that data-center CPU demos often skip: **quota pressure**, **429 storms**, **client-side perf regressions**, and **deploy-shaped regressions**. The copilot optimizes for **explainable signals**, **deploy correlation**, and **honest synthetic traffic** that rides the **same ingest contract** as production beacons.

## Architecture choices (and tradeoffs)

| Decision | Why it helps | Cost / risk |
| --- | --- | --- |
| SQLite rollups + queue | Fast portfolio velocity; single binary mental model | Not a multi-TB TSDB; cardinality must stay controlled |
| Bearer-ingest + replay caps | Makes semi-public beacons less naive | Still not a full OAuth tenant model |
| Schema version `1` in JSON | Lets you evolve events without silent corruption | Requires disciplined additive changes |
| Piecewise linear ETA window | Lightweight, interview-defensible | Sparse or regime-changing traffic widens error; Prophet-style models are optional later |
| Suggest-only alerts | Builds trust before automation | Operators still need paging integrations for real on-call |

## SyntheticReplay narrative

SyntheticReplay traffic is labeled `synthetic_replay` at ingest and surfaced distinctly in the UI. The server enforces **QPS** and **daily caps** (plus a kill switch) so soak tests cannot accidentally spend unbounded time or money.

During replay, watch **queue depth**, **oldest queue age**, and **ingest counters** — they tell a credible story about **lag** and **backpressure** without pretending to be Kafka.

## 10× traffic story (what would change)

With ~10× volume you would shard the queue (SQS/Kafka), move rollups to a stream processor or materializer, and promote hot metrics to a managed TSDB (Mimir/Prometheus/Grafana or a vendor). The **contract** that survives that jump is the **schema version**, **release dimensions**, and **evaluation discipline** — not this SQLite file.

## What we did not build (explicit non-goals)

- Training LLMs on raw logs.
- “AI” alerts without evaluation hooks and runbook explainability.
