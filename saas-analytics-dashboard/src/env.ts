const FIREBASE_KEYS = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
] as const;

function strip(v: string | undefined): string {
  return (v ?? "").trim();
}

function hasFullFirebase(raw: ImportMetaEnv): boolean {
  return FIREBASE_KEYS.every((k) => strip(raw[k]) !== "");
}

/**
 * If `.env` is missing, Vite exposes no `VITE_*` values — run in mock mode so the app still boots.
 * Set `VITE_ENABLE_MOCK=false` only when all Firebase keys are present.
 */
function resolveMockMode(raw: ImportMetaEnv): boolean {
  const v = raw.VITE_ENABLE_MOCK;
  const explicitOn = v === "true" || v === "1";
  const explicitOff = v === "false" || v === "0";
  const firebaseReady = hasFullFirebase(raw);

  if (explicitOn) return true;
  if (explicitOff && !firebaseReady) {
    throw new Error(
      "VITE_ENABLE_MOCK=false but Firebase env vars are missing or empty. Set all VITE_FIREBASE_* keys or use VITE_ENABLE_MOCK=true.",
    );
  }
  if (explicitOff) return false;
  if (!firebaseReady) {
    if (import.meta.env.DEV) {
      console.info("[env] Firebase variables missing; running in mock mode (copy .env.example → .env).");
    }
    return true;
  }
  return false;
}

export const isMockMode = resolveMockMode(import.meta.env);

if (!isMockMode) {
  for (const k of FIREBASE_KEYS) {
    if (!strip(import.meta.env[k])) {
      throw new Error(`${k} is required when mock mode is off.`);
    }
  }
}

export const firebaseConfig = isMockMode
  ? null
  : {
      apiKey: strip(import.meta.env.VITE_FIREBASE_API_KEY),
      authDomain: strip(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
      projectId: strip(import.meta.env.VITE_FIREBASE_PROJECT_ID),
      storageBucket: strip(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
      messagingSenderId: strip(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
      appId: strip(import.meta.env.VITE_FIREBASE_APP_ID),
    };

/** Narrow snapshot for debugging / future use */
export const env = {
  isMockMode,
  hasFirebase: hasFullFirebase(import.meta.env),
} as const;
