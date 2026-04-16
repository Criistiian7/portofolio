import { useMemo } from "react";
import { useTasks } from "../../context/useTasks";
import { isTaskDone } from "../../types/Task";
import { localDateIso } from "../../lib/dates";

type CardProps = {
  label: string;
  value: number;
  accent: string;
};

function MetricCard({ label, value, accent }: CardProps) {
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

export default function MetricsRow() {
  const { tasks } = useTasks();

  const metrics = useMemo(() => {
    const today = localDateIso();
    const active = tasks.filter((task) => !isTaskDone(task));
    const dueToday = active.filter((task) => task.dueDate === today).length;
    const upcoming = active.filter(
      (task) => task.dueDate && task.dueDate > today,
    ).length;

    return {
      active: active.length,
      dueToday,
      upcoming,
    };
  }, [tasks]);

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <MetricCard label="Active" value={metrics.active} accent="bg-amber-400" />
      <MetricCard
        label="Due today"
        value={metrics.dueToday}
        accent="bg-sky-400"
      />
      <MetricCard
        label="Upcoming"
        value={metrics.upcoming}
        accent="bg-violet-400"
      />
    </section>
  );
}
