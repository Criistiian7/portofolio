import { useState, type FormEvent } from "react";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/config";

type Mode = "sign-in" | "sign-up";

const getErrorMessage = (error: unknown) => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "That email is already registered. Sign in instead or use another email.";
      case "auth/invalid-email":
        return "Enter a valid email address.";
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "The email or password is incorrect.";
      case "auth/weak-password":
        return "Use a stronger password with at least 6 characters.";
      case "auth/too-many-requests":
        return "Too many authentication attempts were made. Wait a moment and retry.";
      default:
        return error.message || "Authentication failed. Please try again.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Authentication failed. Please try again.";
};

type Props = {
  onLiveDemo?: () => void;
};

export default function Auth({ onLiveDemo }: Props) {
  const [mode, setMode] = useState<Mode>("sign-in");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!auth) {
      setError("Firebase Authentication is not configured yet. Add your env vars and retry.");
      return;
    }

    const trimmedEmail = email.trim();

    if (mode === "sign-up") {
      const trimmedDisplayName = displayName.trim();
      if (!trimmedDisplayName) {
        setError("Enter a display name to create an account.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Password confirmation does not match.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === "sign-in") {
        await signInWithEmailAndPassword(auth, trimmedEmail, password);
      } else {
        const credentials = await createUserWithEmailAndPassword(
          auth,
          trimmedEmail,
          password,
        );

        await updateProfile(credentials.user, {
          displayName: displayName.trim(),
        });
      }

      setPassword("");
      setConfirmPassword("");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.2),_transparent_28%)]" />
      <form
        className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl"
        onSubmit={(event) => {
          void submit(event);
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
          Secure sign-in
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
          {mode === "sign-in" ? "Welcome back" : "Create your workspace"}
        </h2>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          Sign in to access your task workspace.
        </p>

        <div className="mt-8 inline-flex rounded-2xl border border-white/10 bg-slate-900/70 p-1 text-sm text-slate-300">
          <button
            type="button"
            className={`rounded-2xl px-4 py-2 transition ${
              mode === "sign-in" ? "bg-sky-500 text-slate-950" : "hover:text-white"
            }`}
            onClick={() => {
              setMode("sign-in");
              setError(null);
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`rounded-2xl px-4 py-2 transition ${
              mode === "sign-up" ? "bg-sky-500 text-slate-950" : "hover:text-white"
            }`}
            onClick={() => {
              setMode("sign-up");
              setError(null);
            }}
          >
            Sign up
          </button>
        </div>

        {mode === "sign-up" ? (
          <>
            <label className="mt-6 block text-sm font-medium text-slate-200">
              Display name
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-sky-400"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Enter your name"
              autoComplete="name"
            />
          </>
        ) : null}

        <label className="mt-6 block text-sm font-medium text-slate-200">
          Email
        </label>
        <input
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-sky-400"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />

        <label className="mt-6 block text-sm font-medium text-slate-200">
          Password
        </label>
        <input
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-sky-400"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
        />

        {mode === "sign-up" ? (
          <>
            <label className="mt-6 block text-sm font-medium text-slate-200">
              Confirm password
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-sky-400"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter your password"
              autoComplete="new-password"
            />
          </>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={
            isSubmitting ||
            !email.trim() ||
            !password ||
            (mode === "sign-up" && (!displayName.trim() || !confirmPassword))
          }
          className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-sky-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          {isSubmitting
            ? "Working..."
            : mode === "sign-in"
              ? "Sign in"
              : "Create account"}
        </button>

        {onLiveDemo ? (
          <div className="mt-6 border-t border-white/10 pt-6">
            <p className="text-center text-xs text-slate-400">
              Want to explore first?
            </p>
            <button
              type="button"
              className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-sky-400/40 hover:bg-white/5"
              onClick={() => onLiveDemo()}
            >
              Live Demo
            </button>
          </div>
        ) : null}
      </form>
    </div>
  );
}
