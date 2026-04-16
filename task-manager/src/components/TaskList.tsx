import { useTasks } from "../context/useTasks";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const { tasks, isLoading, error, refreshTasks } = useTasks();
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  if (isLoading) {
    return (
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-center shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
          Loading
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-white">
          Fetching your tasks...
        </h2>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {error ? (
        <div className="rounded-[2rem] border border-rose-400/20 bg-rose-500/10 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-200">
            Sync issue
          </p>
          <h2 className="mt-3 text-xl font-semibold text-white">{error}</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className="inline-flex items-center justify-center rounded-2xl bg-rose-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-rose-300"
              onClick={() => void refreshTasks()}
            >
              Retry
            </button>
          </div>
        </div>
      ) : null}

      {!tasks.length ? (
        <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-8 text-center shadow-xl shadow-slate-950/10 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Empty state
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">No tasks yet</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Create your first task to start building your personal queue.
          </p>
        </div>
      ) : null}

      {activeTasks.length ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
                Active queue
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Work in progress
              </h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
              {activeTasks.length}
            </span>
          </div>
          <div className="space-y-4">
            {activeTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      ) : null}

      {completedTasks.length ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
                Completed
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Recently finished
              </h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
              {completedTasks.length}
            </span>
          </div>
          <div className="space-y-4">
            {completedTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
