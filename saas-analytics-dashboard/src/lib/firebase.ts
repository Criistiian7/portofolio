import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig, isMockMode } from "@/env";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (isMockMode) {
    throw new Error("Firebase is disabled in mock mode");
  }
  if (!app) {
    if (!firebaseConfig) throw new Error("Missing Firebase configuration");
    app = initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (isMockMode) {
    throw new Error("Firebase Auth is disabled in mock mode");
  }
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

export function getFirestoreDb(): Firestore {
  if (isMockMode) {
    throw new Error("Firestore is disabled in mock mode");
  }
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}
