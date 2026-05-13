import { doc, getDoc, setDoc, updateDoc, type DocumentData } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";
import { isMockMode } from "@/env";
import type { UserProfile, UserRole, UserStatus } from "@/types";

const MOCK_PROFILE_KEY = "mock-user-profile";

function defaultProfile(uid: string, email: string, displayName: string): UserProfile {
  return {
    uid,
    email,
    displayName,
    role: "member",
    avatarUrl: null,
    status: "active",
    preferences: {
      emailDigest: true,
      marketing: false,
      tableDensity: "comfortable",
    },
  };
}

function mapProfile(uid: string, data: DocumentData): UserProfile {
  const prefs = (data.preferences ?? {}) as UserProfile["preferences"];
  return {
    uid,
    email: String(data.email ?? ""),
    displayName: String(data.displayName ?? ""),
    role: (data.role as UserRole) ?? "member",
    avatarUrl: data.avatarUrl != null ? String(data.avatarUrl) : null,
    status: (data.status as UserStatus) ?? "active",
    preferences: {
      emailDigest: Boolean(prefs.emailDigest ?? true),
      marketing: Boolean(prefs.marketing ?? false),
      tableDensity: prefs.tableDensity === "compact" ? "compact" : "comfortable",
    },
  };
}

function readMockProfileFromStorage(uid: string): UserProfile | null {
  const raw = window.localStorage.getItem(MOCK_PROFILE_KEY);
  if (!raw) return null;
  try {
    const p = JSON.parse(raw) as UserProfile;
    return p.uid === uid ? p : null;
  } catch {
    return null;
  }
}

function writeMockProfile(p: UserProfile) {
  window.localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(p));
}

export async function getUserProfile(uid: string, emailFallback: string): Promise<UserProfile> {
  if (isMockMode) {
    const existing = readMockProfileFromStorage(uid);
    if (existing) return existing;
    return defaultProfile(uid, emailFallback, emailFallback.split("@")[0] ?? "User");
  }
  const db = getFirestoreDb();
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return defaultProfile(uid, emailFallback, emailFallback.split("@")[0] ?? "User");
  }
  return mapProfile(uid, snap.data());
}

export async function ensureUserProfile(
  uid: string,
  email: string,
  displayName: string,
): Promise<void> {
  if (isMockMode) {
    if (readMockProfileFromStorage(uid)) return;
    writeMockProfile(defaultProfile(uid, email, displayName));
    return;
  }
  const db = getFirestoreDb();
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return;
  const p = defaultProfile(uid, email, displayName);
  await setDoc(ref, {
    email: p.email,
    displayName: p.displayName,
    role: p.role,
    avatarUrl: p.avatarUrl,
    status: p.status,
    preferences: p.preferences,
  });
}

export async function updateUserProfile(
  uid: string,
  patch: Partial<Pick<UserProfile, "displayName" | "avatarUrl" | "preferences">>,
): Promise<UserProfile> {
  if (isMockMode) {
    const base =
      readMockProfileFromStorage(uid) ?? defaultProfile(uid, "user@example.com", "User");
    const next: UserProfile = {
      ...base,
      ...patch,
      preferences: { ...base.preferences, ...patch.preferences },
      uid,
    };
    writeMockProfile(next);
    return next;
  }
  const db = getFirestoreDb();
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Profile missing");
  const cur = mapProfile(uid, snap.data());
  const next: UserProfile = {
    ...cur,
    ...patch,
    preferences: { ...cur.preferences, ...patch.preferences },
  };
  await updateDoc(ref, {
    displayName: next.displayName,
    avatarUrl: next.avatarUrl,
    preferences: next.preferences,
  });
  return next;
}
