import { useMemo, useState } from "react";
import { acceptInvite, declineInvite } from "../../lib/invites";
import { useProfileLabels } from "../../hooks/useProfileLabels";
import type { InviteRow } from "../../hooks/useInvites";

type Tab = "incoming" | "sent";

function statusChip(status: InviteRow["status"]) {
  const base =
    "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset";
  if (status === "pending") {
    return `${base} bg-amber-500/15 text-amber-200 ring-amber-400/30`;
  }
  if (status === "accepted") {
    return `${base} bg-emerald-500/15 text-emerald-200 ring-emerald-400/30`;
  }
  return `${base} bg-slate-500/20 text-slate-300 ring-white/10`;
}

type Props = {
  received: InviteRow[];
  sent: InviteRow[];
  loading: boolean;
  error: string | null;
};

export default function InvitesPanel({ received, sent, loading, error }: Props) {
  const [tab, setTab] = useState<Tab>("incoming");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const uidsForLabels = useMemo(() => {
    const ids = new Set<string>();
    for (const row of received) {
      ids.add(row.fromUid);
    }
    return Array.from(ids);
  }, [received]);

  const { labelFor } = useProfileLabels(uidsForLabels);

  const runAccept = async (inviteId: string) => {
    setBusyId(inviteId);
    setActionMessage(null);
    try {
      await acceptInvite({ inviteId });
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : "Could not accept invite.");
    } finally {
      setBusyId(null);
    }
  };

  const runDecline = async (inviteId: string) => {
    setBusyId(inviteId);
    setActionMessage(null);
    try {
      await declineInvite(inviteId);
    } catch (e) {
      setActionMessage(e instanceof Error ? e.message : "Could not decline invite.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-300">
        Invites
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("incoming")}
          className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
            tab === "incoming"
              ? "bg-violet-500/20 text-violet-100 ring-1 ring-violet-400/40"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          Incoming
        </button>
        <button
          type="button"
          onClick={() => setTab("sent")}
          className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
            tab === "sent"
              ? "bg-violet-500/20 text-violet-100 ring-1 ring-violet-400/40"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          Sent
        </button>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-rose-300">{error}</p>
      ) : null}
      {actionMessage ? (
        <p className="mt-3 text-sm text-amber-200">{actionMessage}</p>
      ) : null}

      {loading ? (
        <p className="mt-3 text-sm text-slate-500">Loading invites…</p>
      ) : tab === "incoming" ? (
        <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
          {received.length === 0 ? (
            <li className="text-sm text-slate-500">No invites yet.</li>
          ) : (
            received.map((row) => (
              <li
                key={row.id}
                className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">
                      From {labelFor(row.fromUid)}
                    </p>
                    <p className="text-xs text-slate-500">{row.toEmail}</p>
                  </div>
                  <span className={statusChip(row.status)}>{row.status}</span>
                </div>
                {row.status === "pending" ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busyId === row.id}
                      onClick={() => void runAccept(row.id)}
                      className="rounded-lg bg-emerald-500/90 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busyId === row.id ? "…" : "Accept"}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === row.id}
                      onClick={() => void runDecline(row.id)}
                      className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Decline
                    </button>
                  </div>
                ) : null}
              </li>
            ))
          )}
        </ul>
      ) : (
        <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
          {sent.length === 0 ? (
            <li className="text-sm text-slate-500">No sent invites yet.</li>
          ) : (
            sent.map((row) => (
              <li
                key={row.id}
                className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{row.toEmail}</p>
                    <p className="text-xs text-slate-500">To recipient</p>
                  </div>
                  <span className={statusChip(row.status)}>{row.status}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
