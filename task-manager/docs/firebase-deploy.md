# Deploy With Firebase CLI

This app ships static files from Vite (`dist/`), Firestore rules from `firestore.rules`, and Cloud Functions from `functions/`. This stack does **not** use SQL, Entity Framework, or `dotnet ef database updates`; database changes are Firestore rules, indexes, and application data only.

Deploy order for a full release: **Firestore rules and indexes**, **Cloud Functions** (set Resend / `APP_PUBLIC_URL` env on the function runtime as needed), then **Hosting** (after `npm run build`). See `docs/manual-release-checklist.md` for manual QA.

## One-Time Setup

1. Install the Firebase CLI: `npm install -g firebase-tools`
2. Log in: `firebase login`
3. From the `task-manager` directory, link the folder to your Firebase project:

   ```bash
   cd task-manager
   firebase use --add
   ```

## Deploy Rules, Indexes, Functions, And Hosting

1. Build the production bundle:

   ```bash
   npm run build
   ```

2. Deploy Firestore rules and indexes (required when `firestore.rules` or `firestore.indexes.json` changed):

   ```bash
   firebase deploy --only firestore:rules,firestore:indexes
   ```

3. Build and deploy Cloud Functions from `task-manager/functions` when `functions/src` changed:

   ```bash
   cd functions
   npm run deploy
   ```

   Or from `task-manager`: `firebase deploy --only functions` after building functions (`cd functions && npm run build`).

4. Deploy Hosting:

   ```bash
   firebase deploy --only hosting
   ```

You can combine targets, for example: `firebase deploy --only firestore:rules,firestore:indexes,functions,hosting`.

After Hosting finishes, copy the printed site URL into your portfolio README and verify the deployed build still uses the intended Firebase project (check `.env.local` values you used at build time).
