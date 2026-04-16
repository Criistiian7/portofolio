import { useState } from "react";
import confetti from "canvas-confetti";
import { useTasks } from "../context/useTasks";
import type { Task } from "../types/Task";
import { isTaskDone } from "../types/Task";
import { auth } from "../firebase/config";
import Modal from "./Modal";
import TaskForm from "./TaskForm";
import { useContacts } from "../hooks/useContacts";
import { useProfileLabels } from "../hooks/useProfileLabels";

type Props = {
  task: Task;
};

export default function TaskItem({ task }: Props) {
  const { deleteTask, toggleTask, updateTask, isTaskPending } = useTasks();
  const currentUid = auth?.currentUser?.uid ?? null;
  const contactUids = useContacts(currentUid);
  const { labelFor } = useProfileLabels(contactUids);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const isPending = isTaskPending(task.id);
  const isOwner = task.ownerId === currentUid;

  const confirm = async () => {
    try {
      await toggleTask(task.id);
      setOpen(false);

      if (!isTaskDone(task)) {
        confetti();
      }
    } catch {
      return;
    }
  };

  return (
    <>
      <article
        className={`rounded-[2rem] border p-5 shadow-xl shadow-slate-950/20 backdrop-blur transition hover:-translate-y-0.5 ${
          isTaskDone(task)
            ? "border-emerald-400/30 bg-emerald-500/10"
            : "border-white/10 bg-white/5"
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              {task.project}
            </p>
            <h3 className="mt-3 text-xl font-semibold text-white">{task.text}</h3>
          </div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              task.priority === "high"
                ? "bg-rose-500/15 text-rose-200"
                : task.priority === "medium"
                  ? "bg-amber-500/15 text-amber-200"
                  : "bg-emerald-500/15 text-emerald-200"
            }`}
          >
            {task.priority}
          </span>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-300">
          {task.description || "No description provided."}
        </p>
        <p className="mt-4 text-sm text-slate-400">
          {task.status === "done"
            ? "Done"
            : task.status === "in_progress"
              ? "In progress"
              : "To do"}{" "}
          • Updated {new Date(task.updatedAt).toLocaleString()}
        </p>

        {editing ? (
          <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/40 p-4">
            <TaskForm
              key={`${task.id}-${task.updatedAt}`}
              initialValues={{
                text: task.text,
                description: task.description,
                priority: task.priority,
                dueDate: task.dueDate,
                project: task.project,
                assigneeUid: task.assigneeUid,
              }}
              submitLabel="Save changes"
              disabled={isPending}
              contactUids={contactUids}
              contactLabel={labelFor}
              ownershipLocked={!isOwner}
              onCancel={() => setEditing(false)}
              onSubmit={async (updatedTask) => {
                await updateTask(task.id, updatedTask);
                setEditing(false);
              }}
            />
          </div>
        ) : (
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              onClick={() => {
                if (isTaskDone(task)) {
                  void toggleTask(task.id).catch(() => {});
                  return;
                }

                setOpen(true);
              }}
              disabled={isPending}
            >
              {isTaskDone(task) ? "Reopen" : "Mark complete"}
            </button>
            <button
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-white/10 disabled:cursor-not-allowed disabled:border-white/5 disabled:text-slate-500"
              onClick={() => setEditing(true)}
              disabled={isPending}
            >
              Edit
            </button>
            {isOwner ? (
              <button
                className="inline-flex items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100 transition hover:border-rose-400/40 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:border-white/5 disabled:text-slate-500"
                onClick={async () => {
                  if (!window.confirm("Delete this task permanently?")) return;
                  try {
                    await deleteTask(task.id);
                  } catch {
                    return;
                  }
                }}
                disabled={isPending}
              >
                Delete
              </button>
            ) : null}
          </div>
        )}
      </article>

      {open ? (
        <Modal
          onYes={() => {
            void confirm();
          }}
          onNo={() => setOpen(false)}
          title="Mark task complete?"
          message="This will move the task into its completed state. You can still reopen it later."
          confirmLabel="Complete task"
          cancelLabel="Keep editing"
          pending={isPending}
        />
      ) : null}
    </>
  );
}
