import { useMemo } from "react";
import type { Task } from "../../types/Task";
import { isTaskDone } from "../../types/Task";

type Props = {
  tasks: Task[];
};

function CompletedRow({ task }: { task: Task }) {
  const name =
    task.assigneeDisplayName?.trim() ||
    (task.assigneeUid ? "Assignee" : "Unassigned");
  const photo = task.assigneePhotoURL;

  return (
    <li className="flex items-start gap-3 rounded-2xl border border-white/5 bg-slate-950/30 px-4 py-3">
      <div className="mt-0.5 shrink-0">
        {photo ? (
          <img
            src={photo}
            alt=""
            className="h-9 w-9 rounded-full border border-white/10 object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-sky-500/20 text-xs font-semibold text-sky-100">
            {name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-500 line-through">
          {task.text}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Completed{" "}
          {new Date(task.updatedAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>
    </li>
  );
}

export default function RecentlyCompleted({ tasks }: Props) {
  const rows = useMemo(() => {
    return tasks
      .filter((task) => isTaskDone(task))
      .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt))
      .slice(0, 8);
  }, [tasks]);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
            Recently completed
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Cleared from the board
          </h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
          {rows.length}
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">
          Completed tasks will show here with a strikethrough and timestamp.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((task) => (
            <CompletedRow key={task.id} task={task} />
          ))}
        </ul>
      )}
    </section>
  );
}
