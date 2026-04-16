import { localDateIso } from "../../lib/dates";

type Props = {
  dark: boolean;
  onToggleTheme: () => void;
};

export default function DashboardHeader({ dark, onToggleTheme }: Props) {
  const today = new Date();
  const formatted = today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
          Today
        </p>
        <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
          {formatted}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Local date: {localDateIso(today)}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          onClick={onToggleTheme}
        >
          {dark ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </div>
  );
}
