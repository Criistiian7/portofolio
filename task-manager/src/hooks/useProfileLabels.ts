import { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Loads `users/{uid}.displayName` for a small list of UIDs (e.g. assignee picker).
 */
export function useProfileLabels(uids: string[]) {
  const [labels, setLabels] = useState<Record<string, string>>({});
  const uidKey = useMemo(() => [...uids].sort().join(","), [uids]);

  useEffect(() => {
    if (!db || uids.length === 0) {
      setLabels({});
      return;
    }

    const firestore = db;

    let cancelled = false;

    void (async () => {
      const unique = Array.from(new Set(uids));
      const entries = await Promise.all(
        unique.map(async (uid) => {
          try {
            const snap = await getDoc(doc(firestore, "users", uid));
            const name = snap.data()?.displayName;
            const label =
              typeof name === "string" && name.trim() ? name.trim() : uid;
            return [uid, label] as const;
          } catch {
            return [uid, uid] as const;
          }
        }),
      );

      if (cancelled) {
        return;
      }

      setLabels(Object.fromEntries(entries));
    })();

    return () => {
      cancelled = true;
    };
  }, [uidKey]);

  const labelFor = (uid: string) => labels[uid] ?? uid;

  return { labelFor, labels };
}
