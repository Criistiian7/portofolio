import { useMemo, useState } from "react";
import { EvaluationPage } from "./pages/EvaluationPage";
import { IncidentPage } from "./pages/IncidentPage";
import { getToken, setToken } from "./api";

type Page = "incident" | "evaluation";

export function App() {
  const [page, setPage] = useState<Page>("incident");
  const [tokenDraft, setTokenDraft] = useState(getToken);

  const title = useMemo(
    () => (page === "incident" ? "Incident Mode" : "Evaluation & quality"),
    [page],
  );

  return (
    <div className="layout">
      <header>
        <h1 style={{ margin: "0 0 0.35rem", fontSize: "1.35rem" }}>Portfolio SRE Copilot</h1>
        <p className="muted" style={{ margin: 0 }}>
          Web-focused observability MVP — ETA windows, deploy correlation, alert lifecycle, SyntheticReplay caps.
        </p>
      </header>

      <nav>
        <button type="button" className={page === "incident" ? "active" : ""} onClick={() => setPage("incident")}>
          Incident Mode
        </button>
        <button
          type="button"
          className={page === "evaluation" ? "active" : ""}
          onClick={() => setPage("evaluation")}
        >
          Evaluation
        </button>
        <span style={{ flex: 1 }} />
        <label className="muted" style={{ display: "flex", gap: "0.35rem", alignItems: "center", fontSize: "0.85rem" }}>
          Bearer (ack/mute/resolve)
          <input
            value={tokenDraft}
            onChange={(e) => setTokenDraft(e.target.value)}
            onBlur={() => setToken(tokenDraft)}
            style={{
              minWidth: 220,
              padding: "0.35rem 0.5rem",
              borderRadius: 6,
              border: "1px solid var(--border)",
              background: "#0f141d",
              color: "var(--text)",
            }}
            placeholder="Same as INGEST_API_KEYS"
          />
        </label>
      </nav>

      <section aria-label={title}>{page === "incident" ? <IncidentPage /> : <EvaluationPage />}</section>
    </div>
  );
}
