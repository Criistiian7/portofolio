import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  type Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { normalizeEmail } from "../lib/invites";
import { useDemoMode } from "../context/DemoModeContext";

export type InviteStatus = "pending" | "accepted" | "declined";

export type InviteRow = {
  id: string;
  fromUid: string;
  toEmail: string;
  status: InviteStatus;
  createdAt: Date | null;
};

function timestampToDate(value: unknown): Date | null {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as Timestamp).toDate === "function"
  ) {
    return (value as Timestamp).toDate();
  }
  return null;
}

function sortByCreatedAtDesc(rows: InviteRow[]) {
  return [...rows].sort((a, b) => {
    const ta = a.createdAt?.getTime() ?? 0;
    const tb = b.createdAt?.getTime() ?? 0;
    return tb - ta;
  });
}

function mapInviteDoc(id: string, raw: Record<string, unknown>): InviteRow | null {
  const fromUid = raw.fromUid;
  const toEmail = raw.toEmail;
  const status = raw.status;
  if (typeof fromUid !== "string" || typeof toEmail !== "string" || typeof status !== "string") {
    return null;
  }
  if (status !== "pending" && status !== "accepted" && status !== "declined") {
    return null;
  }
  return {
    id,
    fromUid,
    toEmail,
    status,
    createdAt: timestampToDate(raw.createdAt),
  };
}

/**
 * Live lists of invites the user sent or received (Firestore read rules apply).
 */
export function useInvites(userEmail: string | null | undefined, userId: string) {
  const demoMode = useDemoMode();
  const normalizedEmail = useMemo(
    () => (userEmail?.trim() ? normalizeEmail(userEmail) : null),
    [userEmail],
  );

  const [received, setReceived] = useState<InviteRow[]>([]);
  const [sent, setSent] = useState<InviteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (demoMode.isDemo) {
      setReceived([]);
      setSent([]);
      setLoading(false);
      setError(null);
      return;
    }

    if (!db || !normalizedEmail || !userId) {
      setReceived([]);
      setSent([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Single-field equality only — no composite index. Sort newest-first in memory.
    const receivedQ = query(
      collection(db, "invites"),
      where("toEmail", "==", normalizedEmail),
    );

    const sentQ = query(
      collection(db, "invites"),
      where("fromUid", "==", userId),
    );

    const unsubReceived = onSnapshot(
      receivedQ,
      (snap) => {
        const rows: InviteRow[] = [];
        for (const docSnap of snap.docs) {
          const row = mapInviteDoc(docSnap.id, docSnap.data() as Record<string, unknown>);
          if (row) {
            rows.push(row);
          }
        }
        setReceived(sortByCreatedAtDesc(rows));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );

    const unsubSent = onSnapshot(
      sentQ,
      (snap) => {
        const rows: InviteRow[] = [];
        for (const docSnap of snap.docs) {
          const row = mapInviteDoc(docSnap.id, docSnap.data() as Record<string, unknown>);
          if (row) {
            rows.push(row);
          }
        }
        setSent(sortByCreatedAtDesc(rows));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );

    return () => {
      unsubReceived();
      unsubSent();
    };
  }, [demoMode, normalizedEmail, userId]);

  return { received, sent, loading, error };
}
