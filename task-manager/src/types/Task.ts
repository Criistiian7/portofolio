export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export type TaskDraft = {
  text: string;
  description: string;
  category: string;
  priority: TaskPriority;
};

export type TaskRecord = TaskDraft & {
  ownerId: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Task = TaskRecord & {
  id: string;
};
