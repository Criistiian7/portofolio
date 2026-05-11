import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "../api";
import { runbookFor, type Runbook } from "../runbooks";

type PipelineHealth = {
  counters: Record<string, number>;
  queueDepth: number;
  oldestQueueAgeMs: number;
};

type Forecast = {
  metricKey: string;
  threshold: number;
  direction: string;
  etaMinMs: number | null;
  etaMaxMs: number | null;
  modelVersion: string;
  confidenceNote: string;
  maeHoldout: number | null;
};

type AlertRow = {
  id: string;
  dedupeKey: string;
  title: string;
  severity: string;
  state: string;
  firedAt: number;
  metadataJson?: string;
};

type DeployMarker = {
  ts: number;
  commitHash?: string | null;
  buildId?: string | null;
  version?: string | null;
  environment?: string | null;
  source?: string;
};

function formatTs(ms: number) {
  return new Date(ms).toISOString().replace("T", " ").slice(0, 19);
}

function sourceFromAlert(a: AlertRow): "live" | "synthetic_replay" | "unknown" {
  if (!a.metadataJson) return "unknown";
  try {
    const meta = JSON.parse(a.metadataJson) as { source?: string };
    if (meta.source === "live" || meta.source === "synthetic_replay") return meta.source;
  } catch {
    /* ignore */
  }
  return "unknown";
}

export function IncidentPage() {
  const [health, setHealth] = useState<PipelineHealth | null>(null);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [movers, setMovers] = useState<{ metricKey: string; delta: number; current: number; previous: number | null }[]>(
    [],
  );
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [deploys, setDeploys] = useState<DeployMarker[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const to = Date.now();
      const from = to - 6 * 60 * 60 * 1000;
      const [h, f, m, a, t] = await Promise.all([
        apiGet<PipelineHealth>("/api/pipeline-health"),
        apiGet<{ forecasts: Forecast[] }>("/api/forecasts"),
        apiGet<{ movers: typeof movers }>("/api/top-movers"),
        apiGet<AlertRow[]>("/api/alerts"),
        apiGet<{ deploys: DeployMarker[] }>(`/api/timeline?from=${from}&to=${to}`),
      ]);
      setHealth(h);
      setForecasts(f.forecasts);
      setMovers(m.movers);
      setAlerts(a);
      setDeploys(t.deploys ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load incident data");
    }
  }, []);

  useEffect(() => {
    void load();
    const id = setInterval(() => void load(), 10_000);
    return () => clearInterval(id);
  }, [load]);

  const runbooks: Runbook[] = useMemo(() => {
    const keys = new Set<string>();
    for (const alert of alerts.slice(0, 12)) {
      if (!alert.metadataJson) continue;
      try {
        const meta = JSON.parse(alert.metadataJson) as { metricKey?: string };
        if (meta.metricKey) keys.add(meta.metricKey);
      } catch {
        /* ignore */
      }
    }
    for (const mv of movers.slice(0, 6)) keys.add(mv.metricKey);
    return [...keys].map((k) => runbookFor(k)).filter((rb): rb is Runbook => Boolean(rb));
  }, [alerts, movers]);

  return (
    <div className="grid">
      {error ? (
        <div className="panel" style={{ borderColor: "var(--crit)" }}>
          <strong>Backend unreachable or error</strong>
          <p className="muted" style={{ margin: "0.5rem 0 0" }}>
            {error}. Start the server on port 4000 and keep this Vite dev server running.
          </p>
        </div>
      ) : null}

      <div className="grid grid-2">
        <div className="panel">
          <h2>Pipeline health</h2>
          {!health ? (
            <p className="muted">Loading…</p>
          ) : (
            <ul className="timeline">
              <li>
                Queue depth: <strong>{health.queueDepth}</strong>
              </li>
              <li>
                Oldest queued age: <strong>{health.oldestQueueAgeMs} ms</strong>
              </li>
              {Object.entries(health.counters).map(([k, v]) => (
                <li key={k}>
                  {k}: <strong>{v}</strong>
                </li>
              ))}
            </ul>
          )}
          <button type="button" className="row-actions" style={{ marginTop: "0.5rem" }} onClick={() => void load()}>
            Refresh
          </button>
        </div>

        <div className="panel">
          <h2>Top movers (last two 5m buckets)</h2>
          {!movers.length ? (
            <p className="muted">No rollup history yet — ingest samples to populate.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Δ</th>
                  <th>Current</th>
                </tr>
              </thead>
              <tbody>
                {movers.slice(0, 8).map((mv) => (
                  <tr key={mv.metricKey}>
                    <td>{mv.metricKey}</td>
                    <td>{mv.delta.toFixed(4)}</td>
                    <td>{mv.current.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="panel">
        <h2>Prediction strip (suggest-only)</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Model version is stamped per forecast; sparse traffic widens ETA windows. This is not auto-remediation.
        </p>
        <div className="strip">
          {forecasts.map((f) => (
            <div key={f.metricKey} className="chip">
              <strong>{f.metricKey}</strong>
              <div style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>dir: {f.direction}</div>
              <div style={{ fontSize: "0.85rem" }}>model: {f.modelVersion}</div>
              <div style={{ fontSize: "0.85rem" }}>
                ETA window:{" "}
                {f.etaMinMs && f.etaMaxMs ? `${formatTs(f.etaMinMs)} → ${formatTs(f.etaMaxMs)}` : "n/a"}
              </div>
              <div className="muted" style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>
                conf: {f.confidenceNote}
                {f.maeHoldout != null ? ` · holdout MAE ${f.maeHoldout.toFixed(4)}` : ""}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-2">
        <div className="panel">
          <h2>Deploy markers</h2>
          {!deploys.length ? (
            <p className="muted">No deploy events — emit `type: &quot;deploy&quot;` beacons from CI or clients.</p>
          ) : (
            <ul className="timeline">
              {deploys.map((d, idx) => {
                const label = [d.version, d.commitHash, d.buildId].filter(Boolean).join(" · ") || "release metadata";
                return (
                  <li key={`${d.ts}-${idx}`}>
                    <div>
                      <span className="muted">{formatTs(d.ts)}</span>{" "}
                      <span className={`badge ${d.source === "synthetic_replay" ? "replay" : "live"}`}>
                        {d.source ?? "unknown"}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.85rem" }}>{label}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="panel">
          <h2>Correlations (recent alerts)</h2>
          {!alerts.length ? (
            <p className="muted">No alerts yet — thresholds evaluate after rollups land.</p>
          ) : (
            <ul className="timeline">
              {alerts
                .slice()
                .reverse()
                .slice(0, 12)
                .map((a) => (
                  <li key={a.id}>
                    <div>
                      <span className={`badge ${a.severity === "critical" ? "crit" : "warn"}`}>{a.severity}</span>{" "}
                      <span className={`badge ${sourceFromAlert(a) === "synthetic_replay" ? "replay" : "live"}`}>
                        {sourceFromAlert(a)}
                      </span>{" "}
                      <span className="muted">{formatTs(a.firedAt)}</span>
                    </div>
                    <div style={{ fontSize: "0.9rem" }}>{a.title}</div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      <div className="panel">
        <h2>Alerts — lifecycle</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Ack / mute / resolve require the bearer token configured above (same value as server ingest key).
        </p>
        <table className="table">
          <thead>
            <tr>
              <th>When</th>
              <th>Severity</th>
              <th>Traffic</th>
              <th>State</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.slice(0, 25).map((a) => (
              <tr key={a.id}>
                <td className="muted">{formatTs(a.firedAt)}</td>
                <td>{a.severity}</td>
                <td>
                  <span className={`badge ${sourceFromAlert(a) === "synthetic_replay" ? "replay" : "live"}`}>
                    {sourceFromAlert(a)}
                  </span>
                </td>
                <td>{a.state}</td>
                <td>{a.title}</td>
                <td>
                  <div className="row-actions">
                    <button type="button" onClick={() => void apiPost(`/api/alerts/${a.id}/ack`).then(load)}>
                      Ack
                    </button>
                    <button
                      type="button"
                      onClick={() => void apiPost(`/api/alerts/${a.id}/mute`, { minutes: 30 }).then(load)}
                    >
                      Mute 30m
                    </button>
                    <button type="button" onClick={() => void apiPost(`/api/alerts/${a.id}/resolve`).then(load)}>
                      Resolve
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h2>Runbook cards</h2>
        {!runbooks.length ? (
          <p className="muted">Runbooks appear when alerts or movers reference a metric.</p>
        ) : (
          runbooks.map((rb) => (
            <div key={rb.metricKey} className="runbook">
              <h3>
                {rb.title} <span className="muted">({rb.metricKey})</span>
              </h3>
              <ol style={{ margin: "0.25rem 0 0.5rem", paddingLeft: "1.1rem", color: "var(--muted)" }}>
                {rb.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {rb.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
