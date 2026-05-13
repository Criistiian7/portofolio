import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type Unsubscribe,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { isMockMode } from "@/env";

export type AppUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

function mapUser(u: User | null): AppUser | null {
  if (!u) return null;
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoURL: u.photoURL,
  };
}

const MOCK_AUTH_EVENT = "saas-analytics-mock-auth";

export function emitMockAuthChanged() {
  window.dispatchEvent(new Event(MOCK_AUTH_EVENT));
}

export function subscribeAuth(cb: (user: AppUser | null) => void): Unsubscribe {
  if (isMockMode) {
    const sync = () => cb(readMockUser());
    sync();
    window.addEventListener(MOCK_AUTH_EVENT, sync);
    return () => window.removeEventListener(MOCK_AUTH_EVENT, sync);
  }
  return onAuthStateChanged(getFirebaseAuth(), (u) => cb(mapUser(u)));
}

export async function signInEmail(email: string, password: string) {
  if (isMockMode) {
    window.localStorage.setItem(
      "mock-auth",
      JSON.stringify({ email, displayName: email.split("@")[0] ?? "Demo" }),
    );
    emitMockAuthChanged();
    return;
  }
  await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function registerEmail(email: string, password: string) {
  if (isMockMode) {
    window.localStorage.setItem(
      "mock-auth",
      JSON.stringify({ email, displayName: email.split("@")[0] ?? "Demo" }),
    );
    emitMockAuthChanged();
    return;
  }
  await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function sendReset(email: string) {
  if (isMockMode) {
    return;
  }
  await sendPasswordResetEmail(getFirebaseAuth(), email);
}

export async function signOutUser() {
  if (isMockMode) {
    window.localStorage.removeItem("mock-auth");
    emitMockAuthChanged();
    return;
  }
  await signOut(getFirebaseAuth());
}

function readMockUser(): AppUser | null {
  const raw = window.localStorage.getItem("mock-auth");
  if (!raw) return null;
  try {
    const { email, displayName } = JSON.parse(raw) as {
      email: string;
      displayName?: string;
    };
    return {
      uid: "mock-user",
      email,
      displayName: displayName ?? null,
      photoURL: null,
    };
  } catch {
    return null;
  }
}
