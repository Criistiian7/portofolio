import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Subscribes to `users/{uid}.contacts` (UID strings) maintained by Cloud Functions when invites are accepted.
 */
export function useContacts(uid: string | null) {
  const [contactUids, setContactUids] = useState<string[]>([]);

  useEffect(() => {
    if (!db || !uid) {
      setContactUids([]);
      return;
    }

    return onSnapshot(doc(db, "users", uid), (snapshot) => {
      const raw = snapshot.data()?.contacts;
      if (!Array.isArray(raw)) {
        setContactUids([]);
        return;
      }

      setContactUids(raw.filter((id): id is string => typeof id === "string"));
    });
  }, [uid]);

  return contactUids;
}
