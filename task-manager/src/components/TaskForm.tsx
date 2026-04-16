import { useState, type FormEvent } from "react";
import {
  TASK_PRIORITIES,
  type TaskDraft,
  type TaskPriority,
} from "../types/Task";

type Props = {
  initialValues?: TaskDraft;
  submitLabel: string;
  onSubmit: (task: TaskDraft) => Promise<void>;
  onCancel?: () => void;
  disabled?: boolean;
};

const DEFAULT_VALUES: TaskDraft = {
  text: "",
  description: "",
  category: "Work",
  priority: "medium",
};

export default function TaskForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
  disabled = false,
}: Props) {
  const [text, setText] = useState(initialValues?.text ?? DEFAULT_VALUES.text);
  const [description, setDescription] = useState(
    initialValues?.description ?? DEFAULT_VALUES.description,
  );
  const [category, setCategory] = useState(
    initialValues?.category ?? DEFAULT_VALUES.category,
  );
  const [priority, setPriority] = useState<TaskPriority>(
    initialValues?.priority ?? DEFAULT_VALUES.priority,
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

    try {
      await onSubmit({
        text: trimmedText,
        description: description.trim(),
        category: category.trim() || DEFAULT_VALUES.category,
        priority,
      });

      if (!initialValues) {
        setText(DEFAULT_VALUES.text);
        setDescription(DEFAULT_VALUES.description);
        setCategory(DEFAULT_VALUES.category);
        setPriority(DEFAULT_VALUES.priority);
      }
    } catch {
      return;
    }
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
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
        <select
          className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          disabled={disabled}
        >
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Other">Other</option>
        </select>

        <select
          className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
          value={priority}
          onChange={(event) => setPriority(event.target.value as TaskPriority)}
          disabled={disabled}
        >
          {TASK_PRIORITIES.map((value) => (
            <option key={value} value={value}>
              {value[0].toUpperCase()}
              {value.slice(1)}
            </option>
          ))}
        </select>
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
          className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
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
