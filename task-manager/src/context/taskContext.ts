import { createContext } from "react";
import type { Task, TaskDraft, TaskStatus } from "../types/Task";

export type TaskContextValue = {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  refreshTasks: () => Promise<void>;
  addTask: (task: TaskDraft) => Promise<void>;
  updateTask: (id: string, task: TaskDraft) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  setTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  isTaskPending: (id: string) => boolean;
};

export const TaskContext = createContext<TaskContextValue | null>(null);
