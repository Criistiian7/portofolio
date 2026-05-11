import { useCallback, useEffect, useState } from "react";
import { apiGet } from "../api";

type EvaluationPayload = {
  note: string;
  alertsLabeled: { synthetic: number; live: number };
  fprProxyOnSyntheticShare: number | null;
  maeHoldoutStyle: Record<string, number | null>;
};

export function EvaluationPage() {
  const [data, setData] = useState<EvaluationPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setData(await apiGet<EvaluationPayload>("/api/evaluation"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load evaluation");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="grid">
      {error ? (
        <div className="panel" style={{ borderColor: "var(--crit)" }}>
          <strong>Could not load evaluation</strong>
          <p className="muted" style={{ margin: "0.5rem 0 0" }}>
            {error}
          </p>
        </div>
      ) : null}

      <div className="panel">
        <h2>Evaluation snapshot</h2>
        {!data ? (
          <p className="muted">Loading…</p>
        ) : (
          <>
            <p style={{ marginTop: 0 }}>{data.note}</p>
            <p>
              <strong>SyntheticReplay vs live alerts (metadata)</strong>
            </p>
            <ul className="timeline">
              <li>
                Synthetic labeled: <strong>{data.alertsLabeled.synthetic}</strong>
              </li>
              <li>
                Live labeled: <strong>{data.alertsLabeled.live}</strong>
              </li>
              <li>
                FPR proxy (synthetic share of labeled alerts):{" "}
                <strong>{data.fprProxyOnSyntheticShare == null ? "n/a" : data.fprProxyOnSyntheticShare.toFixed(3)}</strong>
              </li>
            </ul>
            <p>
              <strong>Holdout-style MAE (coarse)</strong>
            </p>
            <table className="table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>MAE</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.maeHoldoutStyle).map(([k, v]) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td>{v == null ? "n/a" : v.toFixed(5)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="row-actions" style={{ marginTop: "0.75rem" }} onClick={() => void load()}>
              Refresh
            </button>
          </>
        )}
      </div>
    </div>
  );
}
