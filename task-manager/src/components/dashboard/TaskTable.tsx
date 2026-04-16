import { useState } from "react";
import confetti from "canvas-confetti";
import { FaCheck, FaPen, FaTrash } from "react-icons/fa";
import type { Task, TaskDraft } from "../../types/Task";
import { isTaskDone } from "../../types/Task";
import { auth } from "../../firebase/config";
import { useTasks } from "../../context/useTasks";
import TaskForm from "../TaskForm";
import { useContacts } from "../../hooks/useContacts";
import { useProfileLabels } from "../../hooks/useProfileLabels";
import {
  formatDateDdMmYyyy,
  getEffectivePriorityDisplay,
  type EffectivePriorityTier,
} from "../../lib/dates";

type Props = {
  tasks: Task[];
  userId: string;
};

const PRIORITY_TIER_CLASS: Record<EffectivePriorityTier, string> = {
  high: "bg-rose-500/15 text-rose-200",
  medium: "bg-amber-500/15 text-amber-200",
  low: "bg-emerald-500/15 text-emerald-200",
};

function AssigneeCell({ task }: { task: Task }) {
  const name =
    task.assigneeDisplayName?.trim() ||
    (task.assigneeUid ? "Assignee" : "Unassigned");
  const photo = task.assigneePhotoURL;

  if (!task.assigneeUid) {
    return <span className="text-slate-500">—</span>;
  }

  return (
    <div className="flex items-center gap-2">
      {photo ? (
        <img
          src={photo}
          alt=""
          className="h-8 w-8 rounded-full border border-white/10 object-cover"
        />
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-sky-500/20 text-xs font-semibold text-sky-100">
          {name.slice(0, 2).toUpperCase()}
        </span>
      )}
      <span className="max-w-[10rem] truncate text-sm text-slate-200">
        {name}
      </span>
    </div>
  );
}

export default function TaskTable({ tasks, userId }: Props) {
  const { deleteTask, toggleTask, updateTask, isTaskPending } = useTasks();
  const contactUids = useContacts(userId);
  const { labelFor } = useProfileLabels(contactUids);

  const [editing, setEditing] = useState<Task | null>(null);

  const activeRows = tasks.filter((task) => !isTaskDone(task));
  const currentUid = auth?.currentUser?.uid ?? userId;

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
      <div className="flex flex-col gap-2 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
            Active work
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Task table</h2>
        </div>
        <span className="text-sm text-slate-400">
          {activeRows.length} active
        </span>
      </div>

      <div className="overflow-x-auto scrollbar-app">
        <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-px py-4 pr-4 pl-6 font-medium">Status</th>
              <th className="px-px py-4 pr-4 font-medium">Task</th>
              <th className="px-px py-4 pr-4 font-medium">Project</th>
              <th className="px-px py-4 pr-4 font-medium">Priority</th>
              <th className="px-px py-4 pr-4 font-medium">Due</th>
              <th className="px-px py-4 pr-4 font-medium">Assignee</th>
              <th className="px-px py-4 pr-6 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeRows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-slate-400"
                >
                  No active tasks match this view.
                </td>
              </tr>
            ) : (
              activeRows.map((task) => {
                const isOwner = task.ownerId === currentUid;
                const isPending = isTaskPending(task.id);
                const effectivePriority = getEffectivePriorityDisplay(task);

                return (
                  <tr
                    key={task.id}
                    className="border-b border-white/5 bg-slate-950/20 hover:bg-slate-500/5"
                  >
                    <td className="px-px py-3 pr-4 pl-6 align-middle">
                      <span className="inline-flex rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-200">
                        In progress
                      </span>
                    </td>
                    <td className="px-px py-3 pr-4 align-middle">
                      <div className="font-medium text-white">{task.text}</div>
                      {task.description ? (
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {task.description}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-px py-3 pr-4 align-middle text-slate-300">
                      {task.project}
                    </td>
                    <td className="px-px py-3 pr-4 align-middle">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${PRIORITY_TIER_CLASS[effectivePriority.tier]}`}
                      >
                        {effectivePriority.label}
                      </span>
                    </td>
                    <td className="px-px py-3 pr-4 align-middle text-slate-300">
                      {formatDateDdMmYyyy(task.dueDate)}
                    </td>
                    <td className="px-px py-3 pr-4 align-middle">
                      <AssigneeCell task={task} />
                    </td>
                    <td className="px-px py-3 pr-6 align-middle">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          disabled={isPending}
                          title="Mark complete"
                          aria-label="Mark complete"
                          onClick={() => {
                            void toggleTask(task.id).then(() => {
                              confetti({ particleCount: 40, spread: 60 });
                            });
                          }}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/35 bg-emerald-500/10 text-emerald-300 transition hover:border-emerald-400/50 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <FaCheck className="text-base" aria-hidden />
                        </button>
                        <button
                          type="button"
                          disabled={isPending}
                          title="Edit task"
                          aria-label="Edit task"
                          onClick={() => setEditing(task)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-300 transition hover:border-sky-400/45 hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <FaPen className="text-sm" aria-hidden />
                        </button>
                        {isOwner ? (
                          <button
                            type="button"
                            disabled={isPending}
                            title="Delete task"
                            aria-label="Delete task"
                            onClick={async () => {
                              if (
                                !window.confirm("Delete this task permanently?")
                              ) {
                                return;
                              }
                              try {
                                await deleteTask(task.id);
                              } catch {
                                return;
                              }
                            }}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/35 bg-rose-500/10 text-rose-300 transition hover:border-rose-400/50 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <FaTrash className="text-sm" aria-hidden />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-10 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            role="presentation"
            onClick={() => setEditing(null)}
          />
          <div
            className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-2xl scrollbar-app"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-white">Edit task</h3>
            <p className="mt-2 text-sm text-slate-400">
              {editing.ownerId === currentUid
                ? "You own this task. You can reassign it to accepted contacts."
                : "You can update the work details. Project and assignee are locked to the owner."}
            </p>
            <div className="mt-6">
              <TaskForm
                formId="task-edit-form"
                initialValues={{
                  text: editing.text,
                  description: editing.description,
                  priority: editing.priority,
                  dueDate: editing.dueDate,
                  project: editing.project,
                  assigneeUid: editing.assigneeUid,
                }}
                submitLabel="Save changes"
                disabled={isTaskPending(editing.id)}
                contactUids={contactUids}
                contactLabel={labelFor}
                ownershipLocked={editing.ownerId !== currentUid}
                onCancel={() => setEditing(null)}
                onSubmit={async (draft: TaskDraft) => {
                  await updateTask(editing.id, draft);
                  setEditing(null);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
