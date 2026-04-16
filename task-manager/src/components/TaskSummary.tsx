import { useMemo } from "react";
import { useTasks } from "../context/useTasks";
import { isTaskDone } from "../types/Task";

type SummaryCardProps = {
  label: string;
  value: number;
  accent: string;
};

function SummaryCard({ label, value, accent }: SummaryCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-slate-950/10 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        {label}
      </p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <span className="text-3xl font-semibold text-white">{value}</span>
        <span className={`h-3 w-14 rounded-full ${accent}`} />
      </div>
    </div>
  );
}

export default function TaskSummary() {
  const { tasks } = useTasks();

  const summary = useMemo(() => {
    const completed = tasks.filter((task) => isTaskDone(task)).length;
    const active = tasks.length - completed;
    const highPriority = tasks.filter(
      (task) => !isTaskDone(task) && task.priority === "high",
    ).length;

    return {
      total: tasks.length,
      active,
      completed,
      highPriority,
    };
  }, [tasks]);

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Total tasks"
        value={summary.total}
        accent="bg-sky-400"
      />
      <SummaryCard
        label="Active"
        value={summary.active}
        accent="bg-amber-400"
      />
      <SummaryCard
        label="Completed"
        value={summary.completed}
        accent="bg-emerald-400"
      />
      <SummaryCard
        label="High priority"
        value={summary.highPriority}
        accent="bg-rose-400"
      />
    </section>
  );
}
