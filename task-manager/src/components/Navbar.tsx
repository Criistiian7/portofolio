type Props = {
  user: string;
  dark: boolean;
  toggleDark: () => void;
  logout: () => Promise<void> | void;
};

export default function Navbar({ user, dark, toggleDark, logout }: Props) {
  return (
    <header className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
            Task manager
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {user}&apos;s workspace
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Tailwind-driven task tracking with Firebase authentication, Firestore
            persistence, and a persisted theme preference.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            onClick={toggleDark}
          >
            {dark ? "Light mode" : "Dark mode"}
          </button>
          <button
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-rose-400/40 hover:bg-rose-500/15"
            onClick={() => {
              void logout();
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
