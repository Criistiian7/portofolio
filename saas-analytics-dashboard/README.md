# SaaS Analytics Dashboard

Production-style portfolio app: Vite + React + TypeScript, Firebase Auth + Firestore, TanStack Query, Zustand (UI shell only), React Router v6 with lazy routes, Radix primitives, Tailwind design tokens, Recharts, TanStack Table, and `@dnd-kit` for Kanban moves.

## Environment / mock mode

`src/env.ts` resolves mode as follows:

- **`VITE_ENABLE_MOCK=true`** (or `1`) — mock auth + in-memory / local data; no Firebase keys required.
- **`VITE_ENABLE_MOCK=false`** (or `0`) — real Firebase; **all** `VITE_FIREBASE_*` variables must be set or the app throws at startup.
- **Unset `VITE_ENABLE_MOCK`** — if any Firebase key is missing, the app runs in **mock mode** (console info in dev). If every Firebase key is present, Firebase mode is used.

Copy [.env.example](.env.example) to `.env` and adjust. For the fastest local demo:

```bash
VITE_ENABLE_MOCK=true
```

## Quick start

```bash
cd saas-analytics-dashboard
npm install
npm run dev
```

Open the URL Vite prints (e.g. `http://localhost:5173/`).

## Firebase mode

Set `VITE_ENABLE_MOCK=false` and fill all `VITE_FIREBASE_*` variables from your Firebase project.

Deploy [firestore.rules](firestore.rules). Commit [firestore.indexes.json](firestore.indexes.json); when you add compound queries (`where` + `orderBy` on different fields), add the composite definitions Firebase suggests and redeploy indexes.

## Architecture notes

- **Server state:** TanStack Query + repository modules under `src/services/firestore/` and `src/services/auth.ts`. Keys live in `src/lib/queryKeys.ts`.
- **Client UI state:** Zustand (`src/store/`) for sidebar, table density, theme, and ephemeral global search in the top bar.
- **Charts:** Time series and categorical demos load from `src/data/chart-seed.json` to keep the UI fast; Firestore backs domain lists (`tasks`, `invoices`, `activity`, etc.).
- **Auth:** `AuthContext` owns a single `onAuthStateChanged` subscription and bootstraps `users/{uid}` via `ensureUserProfile`.
- **Errors:** Router `errorElement` handles route-level failures; `react-error-boundary` wraps the main outlet tree for render errors in descendants (different scope).

## Acceptance criteria (manual smoke)

Use this as a lightweight “done” checklist before calling the portfolio slice complete:

| Phase | Checks |
|-------|--------|
| **Foundation** | App loads without blank screen; theme toggles and persists; 404 route shows not-found UI. |
| **Auth** | Logged-out user hitting `/app/overview` is redirected to `/login`; after sign-in, redirect to app works; sign-out returns to login. |
| **Data** | With mock mode, tables/charts show data; with Firebase, Firestore reads succeed for the signed-in user only. |
| **Security** | Deployed rules deny reading another user’s `tasks` / `invoices` (different `ownerId`). `users/{uid}` only readable by that uid; **`role` cannot change** on profile update (see rules). |
| **Tables** | Sort, filter, pagination behave; CSV export downloads a valid file for users/invoices. |
| **Tasks** | Create task from list; move card on Kanban updates column after refresh (or optimistic UI + refetch). |
| **Polish** | Skip link focuses main content; reduced-motion preference does not break layout. |

## Out of scope (v1 portfolio)

- Email verification, MFA, OAuth providers.
- App Check, server-side rate limits, anti-abuse on password reset.
- Automated E2E tests (optional Vitest for pure utils only).
- i18n, command palette.
- Offline mutation queue (TanStack Query retries only).

For production hardening, add App Check, DPA/privacy links in the shell footer (see app footer placeholders), and move privileged `role` changes to Admin SDK / Cloud Functions.

## GDPR / production

For a real product, document data region, DPA, and privacy policy links in the shell footer. New profiles default to **`role: member`**; grant `admin` in Firestore (or via admin tooling) if you need full nav for demos.
