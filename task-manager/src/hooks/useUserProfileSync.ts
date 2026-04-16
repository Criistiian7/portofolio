import { useEffect } from "react";
import type { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Keeps `users/{uid}` in sync with Firebase Auth for display name, avatar, and email.
 */
export function useUserProfileSync(user: User | null) {
  useEffect(() => {
    if (!db || !user) {
      return;
    }

    const email = user.email?.toLowerCase().trim() ?? "";

    void setDoc(
      doc(db, "users", user.uid),
      {
        email: email || null,
        displayName: user.displayName ?? null,
        photoURL: user.photoURL ?? null,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    ).catch(() => {
      // Avoid uncaught rejection; rules or offline errors surface elsewhere if needed.
    });
  }, [user?.uid, user?.email, user?.displayName, user?.photoURL]);
}
