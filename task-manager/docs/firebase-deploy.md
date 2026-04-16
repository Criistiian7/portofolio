# Deploy With Firebase CLI

This app ships static files from Vite (`dist/`) and Firestore rules from `firestore.rules`.

## One-Time Setup

1. Install the Firebase CLI: `npm install -g firebase-tools`
2. Log in: `firebase login`
3. From the `task-manager` directory, link the folder to your Firebase project:

   ```bash
   cd task-manager
   firebase use --add
   ```

## Deploy Rules And Hosting

1. Build the production bundle:

   ```bash
   npm run build
   ```

2. Deploy Firestore rules and Hosting together:

   ```bash
   firebase deploy --only firestore:rules,hosting
   ```

After Hosting finishes, copy the printed site URL into your portfolio README and verify the deployed build still uses the intended Firebase project (check `.env.local` values you used at build time).
