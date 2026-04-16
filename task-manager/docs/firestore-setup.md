# Firestore Setup And Data Model

## Authenticated Ownership Model

This app now uses Firebase Authentication with email/password sign-in.

- Each signed-in Firebase user gets a stable `uid`.
- New task documents store that `uid` in `ownerId`.
- Reads query Firestore by `ownerId`.
- Firestore security rules are the real authorization boundary.
- Signing out removes access because `request.auth` becomes `null`.

Existing demo-owned documents can be treated as throwaway seed data. They will not match a real authenticated `uid`, so they should not be considered part of the live data model.

## Task Schema

Collection: `tasks`

Document shape:

```json
{
  "text": "Ship portfolio refresh",
  "description": "Replace placeholder README and finish screenshots",
  "category": "Work",
  "priority": "high",
  "ownerId": "firebase-auth-uid",
  "completed": false,
  "createdAt": "2026-04-16T18:20:00.000Z",
  "updatedAt": "2026-04-16T18:20:00.000Z"
}
```

Field expectations:

- `text`: non-empty string
- `description`: string, may be empty
- `category`: string
- `priority`: `low` | `medium` | `high`
- `ownerId`: Firebase Auth `uid`
- `completed`: boolean
- `createdAt`: ISO timestamp string
- `updatedAt`: ISO timestamp string

## Checked-In Rules

The repo now includes enforceable rules in `firestore.rules`.

Those rules require:

- create: `request.auth != null` and `request.resource.data.ownerId == request.auth.uid`
- read/delete: stored `resource.data.ownerId == request.auth.uid`
- update: both the stored and incoming `ownerId` must remain equal to `request.auth.uid`

Deploy the rules with Firebase CLI (see `firebase.json` and `docs/firebase-deploy.md`) or paste the same contents into the Firebase console rules editor for the target project.

## Query Requirements

The app queries:

- `tasks` where `ownerId == <firebase-auth-uid>`

If Firestore requests an index in your project, create it in the Firebase console and retry.

## Environment Variables

Copy `.env.example` to `.env.local` and provide your Firebase project values:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

If required env vars are missing, the app stops at a setup screen so the selected Firebase project is always explicit.
