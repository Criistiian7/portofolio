export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export type TaskDraft = {
  text: string;
  description: string;
  priority: TaskPriority;
  /** ISO date string (YYYY-MM-DD) or null */
  dueDate: string | null;
  project: string;
  assigneeUid: string | null;
};

export type TaskRecord = TaskDraft & {
  ownerId: string;
  status: TaskStatus;
  participantIds: string[];
  /** Denormalized for table display; optional when unassigned */
  assigneeDisplayName?: string | null;
  assigneePhotoURL?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Task = TaskRecord & {
  id: string;
};

export const isTaskDone = (task: Task) => task.status === "done";
