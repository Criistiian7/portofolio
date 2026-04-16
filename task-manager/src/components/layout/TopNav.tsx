import type { User } from "firebase/auth";
import { FaBell, FaSearch } from "react-icons/fa";

type Props = {
  user: User;
  workspaceTitle: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSignOut: () => void;
  signOutLabel?: string;
};

function UserAvatar({ user }: { user: User }) {
  const label =
    user.displayName?.trim() || user.email?.trim() || "User";
  const initials = label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (user.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt=""
        className="h-10 w-10 rounded-full border border-white/10 object-cover"
      />
    );
  }

  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-sky-500/20 text-sm font-semibold text-sky-100">
      {initials || "?"}
    </span>
  );
}

export default function TopNav({
  user,
  workspaceTitle,
  searchQuery,
  onSearchChange,
  onSignOut,
  signOutLabel = "Sign out",
}: Props) {
  return (
    <header className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src="/app-logo.svg"
            alt="Task Manager logo"
            className="h-11 w-11 shrink-0 rounded-2xl border border-white/10 bg-slate-950/40 object-cover shadow-lg shadow-slate-950/30"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
              Task Manager
            </p>
            <h1 className="truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
              {workspaceTitle}
            </h1>
          </div>
        </div>

        <label className="relative flex w-full max-w-xl flex-1 items-center">
          <FaSearch className="pointer-events-none absolute left-4 text-slate-500" aria-hidden />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search tasks…"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
            type="search"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-slate-500 hover:bg-white/10"
          aria-label="Notifications"
        >
          <FaBell className="text-lg" />
        </button>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2">
          <UserAvatar user={user} />
          <div className="hidden text-right text-sm sm:block">
            <p className="font-medium text-white">
              {user.displayName?.trim() || "Signed-in user"}
            </p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-rose-400/40 hover:bg-rose-500/15"
          onClick={() => {
            void onSignOut();
          }}
        >
          {signOutLabel}
        </button>
      </div>
    </header>
  );
}
