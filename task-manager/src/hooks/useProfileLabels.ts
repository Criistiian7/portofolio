import { useEffect, useMemo, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useDemoMode } from "../context/DemoModeContext";

/**
 * Loads `users/{uid}.displayName` for a small list of UIDs (e.g. assignee picker).
 */
export function useProfileLabels(uids: string[]) {
  const demoMode = useDemoMode();
  const [labels, setLabels] = useState<Record<string, string>>({});
  const uidKey = useMemo(() => [...uids].sort().join(","), [uids]);

  useEffect(() => {
    if (demoMode.isDemo) {
      const next: Record<string, string> = {};
      for (const uid of new Set(uids)) {
        next[uid] = demoMode.demoLabels[uid] ?? uid;
      }
      setLabels(next);
      return;
    }

    if (!db || uids.length === 0) {
      setLabels({});
      return;
    }

    const firestore = db;
    const unique = Array.from(new Set(uids));
    const nextLabels: Record<string, string> = Object.fromEntries(
      unique.map((uid) => [uid, uid]),
    );

    setLabels(nextLabels);

    const unsubs = unique.map((uid) =>
      onSnapshot(
        doc(firestore, "users", uid),
        (snap) => {
          const name = snap.data()?.displayName;
          const label = typeof name === "string" && name.trim() ? name.trim() : uid;
          setLabels((current) => ({ ...current, [uid]: label }));
        },
        () => {
          setLabels((current) => ({ ...current, [uid]: uid }));
        },
      ),
    );

    return () => {
      for (const unsub of unsubs) {
        unsub();
      }
    };
  }, [uidKey, demoMode]);

  const labelFor = (uid: string) => labels[uid] ?? uid;

  return { labelFor, labels };
}
