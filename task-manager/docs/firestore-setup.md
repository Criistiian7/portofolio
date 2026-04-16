# Firestore Setup And Data Model

## Authenticated Ownership Model

This app uses Firebase Authentication with email/password sign-in.

- Each signed-in Firebase user gets a stable `uid`.
- Task documents store `ownerId` and a `participantIds` array so assignees can read and update tasks without being the owner.
- The client loads tasks with **both**:
  - `where("participantIds", "array-contains", <uid>)`
  - `where("ownerId", "==", <uid>)` (legacy tasks without `participantIds` still appear until they are updated)
- Firestore security rules are the authorization boundary.
- Signing out removes access because `request.auth` becomes `null`.

## Collections

### `tasks`

Document shape (new schema):

```json
{
  "text": "Ship portfolio refresh",
  "description": "Replace placeholder README and finish screenshots",
  "priority": "high",
  "dueDate": "2026-04-16",
  "project": "Work",
  "ownerId": "firebase-auth-uid",
  "status": "todo",
  "participantIds": ["firebase-auth-uid", "assignee-uid"],
  "assigneeUid": "assignee-uid",
  "assigneeDisplayName": "Alex",
  "assigneePhotoURL": "https://...",
  "createdAt": "2026-04-16T18:20:00.000Z",
  "updatedAt": "2026-04-16T18:20:00.000Z"
}
```

Field expectations:

- `text`: non-empty string
- `description`: string, may be empty
- `priority`: `low` | `medium` | `high`
- `dueDate`: ISO date string (`YYYY-MM-DD`) or `null`
- `project`: string (used for sidebar filters)
- `ownerId`: Firebase Auth `uid`
- `status`: `todo` | `in_progress` | `done`
- `participantIds`: unique string array containing at least `ownerId` and any `assigneeUid`
- `assigneeUid`: string or `null`
- `assigneeDisplayName` / `assigneePhotoURL`: optional denormalized fields for table rendering
- `createdAt` / `updatedAt`: ISO timestamp strings

Legacy documents may still contain `completed: boolean` and `category: string`. The client maps `completed` into `status` and treats `category` as `project` when `project` is missing.

### `users`

Profile documents keyed by Auth `uid`:

- `email`, `displayName`, `photoURL`, `updatedAt` (client-maintained via merge writes)
- `contacts` (UID array, **server-maintained** when invites are accepted)

Security rules allow **any signed-in user** to read the full `users/{uid}` document (not only public fields). Collaborators who know another user’s UID can therefore see that user’s stored email and profile fields. If you need stricter isolation, use a separate public profile collection and restrict `users` reads to self-only (see project planning notes).

### `invites`

Invite documents are **created only by Cloud Functions** (`createInvite`). Clients can read invites they sent or received, but cannot write invites directly.

Typical fields:

- `fromUid`, `toEmail`, `status` (`pending` | `accepted` | `declined`)
- `createdAt` (server timestamp on create)
- `acceptedAt` (set when accepted)
- `declinedAt` (set when declined via `declineInvite`)

## Cloud Functions

The `task-manager/functions` package exposes:

- `createInvite` (callable): authenticated user invites an email address; optional email delivery via Resend when `RESEND_API_KEY` and `INVITE_FROM_EMAIL` are configured on the function runtime.
- `acceptInvite` (callable): links pending invites for the signed-in user’s email and merges reciprocal `contacts` entries. Request may include optional `inviteId` to accept a single invite; if omitted, all pending invites for that email are processed (deep-link catch-up and inbox flows).
- `declineInvite` (callable): sets a single pending invite to `declined` for the signed-in recipient (`inviteId` required); does not change `contacts`.

Configure hosting URL for invite links with `APP_PUBLIC_URL` on the function runtime (for example your Firebase Hosting domain).

## Checked-In Rules

The repo includes enforceable rules in `firestore.rules`.

Deploy the rules with Firebase CLI (see `firebase.json` and `docs/firebase-deploy.md`) or paste the same contents into the Firebase console rules editor for the target project.

## Query Requirements

The app queries:

- `tasks` where `participantIds` array-contains `<uid>`
- `tasks` where `ownerId == <uid>` (legacy compatibility)

If Firestore requests an index in your project, create it in the Firebase console and retry. Checked-in composites for `invites` include `toEmail` + `status`, `toEmail` + `createdAt`, and `fromUid` + `createdAt` (see `firestore.indexes.json`).

## Environment Variables

Copy `.env.example` to `.env.local` and provide your Firebase project values:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_FIREBASE_FUNCTIONS_REGION` (defaults to `us-central1` if omitted; must match deployed callable region)

If required env vars are missing, the app stops at a setup screen so the selected Firebase project is always explicit.
