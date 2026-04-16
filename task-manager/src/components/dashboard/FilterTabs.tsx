import type { TaskStatus } from "../../types/Task";

export type StatusTab = "all" | TaskStatus;

type Props = {
  value: StatusTab;
  onChange: (value: StatusTab) => void;
};

const TABS: { id: StatusTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "in_progress", label: "In progress" },
  { id: "done", label: "Done" },
];

export default function FilterTabs({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-slate-950/40 p-1">
      {TABS.map((tab) => {
        const active = tab.id === value;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
              active
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                : "text-slate-300 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
