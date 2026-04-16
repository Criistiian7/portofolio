import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../firebase/config";

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export async function createInvite(toEmail: string) {
  if (!functions) {
    throw new Error("Firebase is not configured.");
  }

  const callable = httpsCallable(functions, "createInvite");
  await callable({ toEmail: toEmail.trim() });
}

export async function acceptInvite(params?: { inviteId?: string }) {
  if (!functions) {
    throw new Error("Firebase is not configured.");
  }

  const callable = httpsCallable(functions, "acceptInvite");
  const inviteId = params?.inviteId?.trim();
  await callable(inviteId ? { inviteId } : {});
}

export async function declineInvite(inviteId: string) {
  if (!functions) {
    throw new Error("Firebase is not configured.");
  }

  const callable = httpsCallable(functions, "declineInvite");
  await callable({ inviteId: inviteId.trim() });
}

/**
 * Returns whether the signed-in user's email has at least one pending invite
 * (same normalization as Firestore rules). Used to avoid unnecessary acceptInvite calls.
 */
export async function hasPendingInvitesForUserEmail(email: string) {
  if (!db) {
    return false;
  }

  const q = query(
    collection(db, "invites"),
    where("toEmail", "==", normalizeEmail(email)),
    where("status", "==", "pending"),
    limit(1),
  );

  const snap = await getDocs(q);
  return !snap.empty;
}
