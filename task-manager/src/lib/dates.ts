import type { TaskPriority } from "../types/Task";

/** Local calendar date as YYYY-MM-DD (for due date inputs and comparisons). */
export function localDateIso(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Display a YYYY-MM-DD value as dd/mm/yyyy. */
export function formatDateDdMmYyyy(isoDate: string | null | undefined): string {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    return "—";
  }
  const [, m, d] = isoDate.split("-");
  const y = isoDate.slice(0, 4);
  return `${d}/${m}/${y}`;
}

/** Whole calendar days from today until due (local); negative if overdue. */
export function calendarDaysUntilDue(
  dueDateIso: string | null,
  todayIso: string = localDateIso(),
): number | null {
  if (!dueDateIso || !/^\d{4}-\d{2}-\d{2}$/.test(dueDateIso)) {
    return null;
  }
  const t0 = new Date(`${todayIso}T12:00:00`).getTime();
  const t1 = new Date(`${dueDateIso}T12:00:00`).getTime();
  return Math.round((t1 - t0) / (24 * 60 * 60 * 1000));
}

export type EffectivePriorityTier = "low" | "medium" | "high";

/**
 * When a due date exists: Normal if &gt;5 days left, Important if 3–5 days,
 * Critical if ≤2 days or overdue. Without a due date, uses stored priority.
 */
export function getEffectivePriorityDisplay(task: {
  priority: TaskPriority;
  dueDate: string | null;
}): { label: string; tier: EffectivePriorityTier } {
  const days = calendarDaysUntilDue(task.dueDate);
  if (days !== null) {
    if (days <= 2) {
      return { label: "Critical", tier: "high" };
    }
    if (days <= 5) {
      return { label: "Important", tier: "medium" };
    }
    return { label: "Normal", tier: "low" };
  }

  const stored: Record<TaskPriority, { label: string; tier: EffectivePriorityTier }> = {
    low: { label: "Normal", tier: "low" },
    medium: { label: "Important", tier: "medium" },
    high: { label: "Critical", tier: "high" },
  };
  return stored[task.priority];
}

/** Local display for an ISO timestamp: dd/mm/yyyy, hh:mm */
export function formatDateTimeDdMmYyyy(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy}, ${h}:${min}`;
}
