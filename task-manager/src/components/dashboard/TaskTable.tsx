import { useState } from "react";
import confetti from "canvas-confetti";
import type { Task, TaskDraft, TaskStatus } from "../../types/Task";
import { isTaskDone } from "../../types/Task";
import { auth } from "../../firebase/config";
import { useTasks } from "../../context/useTasks";
import TaskForm from "../TaskForm";
import { useContacts } from "../../hooks/useContacts";
import { useProfileLabels } from "../../hooks/useProfileLabels";

type Props = {
  tasks: Task[];
  userId: string;
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

const PRIORITY_LABEL: Record<Task["priority"], string> = {
  high: "Critical",
  medium: "Important",
  low: "Normal",
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
  const { deleteTask, toggleTask, updateTask, setTaskStatus, isTaskPending } =
    useTasks();
  const contactUids = useContacts(userId);
  const { labelFor } = useProfileLabels(contactUids);

  const [editing, setEditing] = useState<Task | null>(null);

  const activeRows = tasks.filter((task) => !isTaskDone(task));
  const currentUid = auth?.currentUser?.uid ?? null;

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

                return (
                  <tr
                    key={task.id}
                    className="border-b border-white/5 bg-slate-950/20 hover:bg-slate-500/5"
                  >
                    <td className="px-px py-3 pr-4 pl-6 align-middle">
                      <select
                        value={task.status}
                        disabled={isPending}
                        onChange={(event) => {
                          void setTaskStatus(
                            task.id,
                            event.target.value as TaskStatus,
                          );
                        }}
                        className="w-full min-w-[8rem] rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-xs text-white outline-none focus:border-sky-400 disabled:opacity-50"
                      >
                        {(Object.keys(STATUS_LABEL) as TaskStatus[]).map(
                          (key) => (
                            <option key={key} value={key}>
                              {STATUS_LABEL[key]}
                            </option>
                          ),
                        )}
                      </select>
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
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${task.priority === "high"
                            ? "bg-rose-500/15 text-rose-200"
                            : task.priority === "medium"
                              ? "bg-amber-500/15 text-amber-200"
                              : "bg-emerald-500/15 text-emerald-200"
                          }`}
                      >
                        {PRIORITY_LABEL[task.priority]}
                      </span>
                    </td>
                    <td className="px-px py-3 pr-4 align-middle text-slate-300">
                      {task.dueDate
                        ? new Date(
                          `${task.dueDate}T12:00:00`,
                        ).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-px py-3 pr-4 align-middle">
                      <AssigneeCell task={task} />
                    </td>
                    <td className="px-px py-3 pr-6 align-middle">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => {
                            void toggleTask(task.id).then(() => {
                              confetti({ particleCount: 40, spread: 60 });
                            });
                          }}
                          className="rounded-xl bg-emerald-500/90 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                        >
                          Complete
                        </button>
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => setEditing(task)}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Edit
                        </button>
                        {isOwner ? (
                          <button
                            type="button"
                            disabled={isPending}
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
                            className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-100 transition hover:border-rose-400/40 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Delete
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
