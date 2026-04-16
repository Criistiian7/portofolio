# Manual Test And Release Checklist

## Core Manual Test Pass

Run these checks before calling the project portfolio-ready:

1. Open the app with an empty browser session and confirm the Firebase auth screen appears.
2. Create a new account with email/password and verify the dashboard loads without console-visible runtime failures.
3. Create a task with each priority value and confirm it appears in the active queue.
4. Create a task with an empty description and confirm rendering still looks intentional.
5. Edit an existing task and verify title, description, category, and priority all persist.
6. Mark an active task complete and confirm it moves into the completed section.
7. Reopen a completed task and confirm it returns to the active queue.
8. Delete a task and confirm the confirmation prompt prevents accidental removal.
9. Refresh the page and confirm tasks still load for the current authenticated account.
10. Toggle dark mode, refresh, and confirm the preference persists.
11. Sign out and confirm task access is removed until another user signs in.
12. Sign in with a second account and confirm it sees a separate scoped workspace.
13. Trigger a Firestore permission failure intentionally, if possible, and confirm the UI shows a readable error.
14. Check the layout on a narrow mobile viewport and a desktop viewport.
15. **Invites:** Send an invite to a second account’s email; confirm it appears under **Sent** for the inviter and **Incoming** for the recipient. Decline on the recipient and confirm status updates. Send another invite, open the `?invite=` link (or use **Accept** in the sidebar), and confirm both users appear in each other’s contacts for assignment.

## Release Readiness

1. Populate `.env.local` and confirm the selected Firebase project is intentional.
2. Enable Firebase Authentication email/password for the target project.
3. Deploy Firestore rules, indexes, Cloud Functions, and Hosting using `docs/firebase-deploy.md` (or an equivalent pipeline). This project does not use SQL migrations or Entity Framework; rollout is Firebase-only.
4. Verify Firestore collection `tasks` exists and supports the current query strategy.
5. Review the README and confirm every claimed feature exists in the UI.
6. Run your local lint/build checks before publishing.
7. Replace `docs/screenshots/*.png` with real UI captures if the README should match production pixels.
8. Verify the deployed build points to the correct Firebase project.
9. Confirm the app shows the setup screen, not a silent fallback connection, when Firebase env vars are missing.
10. Open the deployed site and confirm `/og-share.png` loads for link previews (optionally switch to an absolute `og:image` URL if a validator complains).
