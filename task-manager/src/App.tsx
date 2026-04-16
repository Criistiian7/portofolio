import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { TaskProvider } from "./context/TaskProvider";
import Auth from "./components/Auth";
import DashboardView from "./components/dashboard/DashboardView";
import AppShell from "./components/layout/AppShell";
import { auth, firebaseConfigError, firebaseProjectId } from "./firebase/config";
import { useUserProfileSync } from "./hooks/useUserProfileSync";
import { acceptInvite, hasPendingInvitesForUserEmail } from "./lib/invites";

function AuthenticatedApp({ user }: { user: User }) {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useUserProfileSync(user);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hadInvite = params.has("invite");
    const inviteParam = params.get("invite")?.trim() ?? null;

    const email = user.email?.trim();
    if (!email) {
      return;
    }

    const stripInviteFromUrl = () => {
      if (!hadInvite) {
        return;
      }
      params.delete("invite");
      const query = params.toString();
      const next = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
      window.history.replaceState({}, "", next);
    };

    void (async () => {
      try {
        let shouldCall = Boolean(inviteParam);

        if (!shouldCall) {
          try {
            shouldCall = await hasPendingInvitesForUserEmail(email);
          } catch {
            shouldCall = true;
          }
        }

        if (!shouldCall) {
          return;
        }

        if (inviteParam) {
          await acceptInvite({ inviteId: inviteParam });
        } else {
          await acceptInvite();
        }
      } catch {
        // best-effort; user can accept from the sidebar inbox
      } finally {
        stripInviteFromUrl();
      }
    })();
  }, [user.uid, user.email]);

  return (
    <TaskProvider userId={user.uid}>
      <AppShell>
        <DashboardView
          user={user}
          dark={dark}
          onToggleTheme={() => setDark((current) => !current)}
          onSignOut={async () => {
            if (!auth) return;
            await signOut(auth);
          }}
        />
      </AppShell>
    </TaskProvider>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(() => auth === null);

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsAuthReady(true);
    });

    return unsubscribe;
  }, []);

  if (firebaseConfigError) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center">
          <section className="w-full rounded-[2rem] border border-amber-400/20 bg-white/5 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
              Setup required
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              Configure Firebase before using this app
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              {firebaseConfigError}
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              This portfolio app uses Firebase Authentication and Firestore, so it
              now requires explicit environment configuration before anyone can sign
              in or access task data.
            </p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-300">
              <p>
                Expected file: <code>.env.local</code>
              </p>
              <p className="mt-2">
                Selected project:{" "}
                <code>{firebaseProjectId ?? "not configured"}</code>
              </p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (!isAuthReady) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center">
          <section className="w-full rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
              Checking session
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              Restoring authentication state
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Firebase is verifying whether there is an active signed-in session for
              this browser.
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (!user) return <Auth />;

  return <AuthenticatedApp user={user} />;
}
