import { useTasks } from "../context/useTasks";
import TaskForm from "./TaskForm";

export default function TaskInput() {
  const { addTask, isCreating } = useTasks();

  return (
    <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
      <div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
            Create task
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Add something worth shipping
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            New tasks are created for the signed-in account with ownership,
            timestamps, and consistent priority metadata.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <TaskForm
          submitLabel="Add task"
          onSubmit={addTask}
          disabled={isCreating}
        />
      </div>
    </aside>
  );
}
