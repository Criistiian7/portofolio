import { useState, type FormEvent } from "react";
import {
  TASK_PRIORITIES,
  type TaskDraft,
  type TaskPriority,
} from "../types/Task";

export const PROJECT_OPTIONS = [
  "General",
  "Work",
  "Personal",
  "Design",
  "Inbox",
] as const;

type Props = {
  formId?: string;
  initialValues?: TaskDraft;
  submitLabel: string;
  onSubmit: (task: TaskDraft) => Promise<void>;
  onCancel?: () => void;
  disabled?: boolean;
  /** UIDs of accepted contacts for assignee selection */
  contactUids?: string[];
  contactLabel?: (uid: string) => string;
  /** When true, project and assignee cannot be changed (assignee editing someone else's task). */
  ownershipLocked?: boolean;
};

const DEFAULT_VALUES: TaskDraft = {
  text: "",
  description: "",
  priority: "medium",
  dueDate: null,
  project: "General",
  assigneeUid: null,
};

export default function TaskForm({
  formId,
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
  disabled = false,
  contactUids = [],
  contactLabel,
  ownershipLocked = false,
}: Props) {
  const [text, setText] = useState(initialValues?.text ?? DEFAULT_VALUES.text);
  const [description, setDescription] = useState(
    initialValues?.description ?? DEFAULT_VALUES.description,
  );
  const [project, setProject] = useState(
    initialValues?.project ?? DEFAULT_VALUES.project,
  );
  const [priority, setPriority] = useState<TaskPriority>(
    initialValues?.priority ?? DEFAULT_VALUES.priority,
  );
  const [dueDate, setDueDate] = useState<string>(
    initialValues?.dueDate ?? "",
  );
  const [assigneeUid, setAssigneeUid] = useState<string | null>(
    initialValues?.assigneeUid ?? null,
  );
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedText = text.trim();
    if (!trimmedText) {
      setFormError("Task title is required.");
      return;
    }

    setFormError(null);

    const draft: TaskDraft = {
      text: trimmedText,
      description: description.trim(),
      priority,
      dueDate: dueDate.trim() ? dueDate.trim() : null,
      project: project.trim() || DEFAULT_VALUES.project,
      assigneeUid,
    };

    try {
      await onSubmit(draft);

      if (!initialValues) {
        setText(DEFAULT_VALUES.text);
        setDescription(DEFAULT_VALUES.description);
        setProject(DEFAULT_VALUES.project);
        setPriority(DEFAULT_VALUES.priority);
        setDueDate("");
        setAssigneeUid(null);
      }
    } catch {
      return;
    }
  };

  return (
    <form
      id={formId}
      className="grid gap-4"
      onSubmit={handleSubmit}
    >
      <input
        className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Task title"
        disabled={disabled}
      />
      <textarea
        className="min-h-28 w-full resize-y rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Description"
        disabled={disabled}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          <span className="font-medium text-slate-200">Due date</span>
          <input
            type="date"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            disabled={disabled}
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-300">
          <span className="font-medium text-slate-200">Project</span>
          <select
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
            value={project}
            onChange={(event) => setProject(event.target.value)}
            disabled={disabled || ownershipLocked}
          >
            {PROJECT_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          <span className="font-medium text-slate-200">Priority</span>
          <select
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
            value={priority}
            onChange={(event) => setPriority(event.target.value as TaskPriority)}
            disabled={disabled}
          >
            {TASK_PRIORITIES.map((value) => (
              <option key={value} value={value}>
                {value === "high"
                  ? "Critical"
                  : value === "medium"
                    ? "Important"
                    : "Normal"}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm text-slate-300">
          <span className="font-medium text-slate-200">Assignee</span>
          <select
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
            value={assigneeUid ?? ""}
            onChange={(event) =>
              setAssigneeUid(event.target.value ? event.target.value : null)
            }
            disabled={disabled || ownershipLocked}
          >
            <option value="">Unassigned</option>
            {contactUids.map((uid) => (
              <option key={uid} value={uid}>
                {contactLabel ? contactLabel(uid) : uid}
              </option>
            ))}
          </select>
        </label>
      </div>

      {formError ? (
        <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {formError}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          {disabled ? "Saving..." : submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-white/10 disabled:cursor-not-allowed disabled:border-white/5 disabled:text-slate-500"
            onClick={onCancel}
            disabled={disabled}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
