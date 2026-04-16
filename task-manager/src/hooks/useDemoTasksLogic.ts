import { useCallback, useMemo, useState } from "react";
import { createDemoTasks } from "../demo/demoTasks";
import { DEMO_LABELS } from "../demo/constants";
import type { Task, TaskDraft, TaskStatus } from "../types/Task";

function normalizeParticipantIds(
  ownerId: string,
  assigneeUid: string | null,
  existing?: string[],
): string[] {
  const merged = new Set<string>([ownerId]);
  if (assigneeUid) merged.add(assigneeUid);
  if (existing) {
    for (const id of existing) merged.add(id);
  }
  return Array.from(merged);
}

function assigneeDenorm(assigneeUid: string | null): {
  assigneeDisplayName: string | null;
  assigneePhotoURL: string | null;
} {
  if (!assigneeUid) {
    return { assigneeDisplayName: null, assigneePhotoURL: null };
  }
  const name = DEMO_LABELS[assigneeUid]?.trim() || null;
  return {
    assigneeDisplayName: name,
    assigneePhotoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(assigneeUid)}`,
  };
}

export function useDemoTasksLogic(userId: string) {
  const seedTasks = useMemo(() => createDemoTasks(), []);
  const [tasks, setTasks] = useState<Task[]>(() => structuredClone(seedTasks));
  const [isCreating, setIsCreating] = useState(false);
  const [pendingTaskIds, setPendingTaskIds] = useState<string[]>([]);

  const setTaskPending = (taskId: string, isPending: boolean) => {
    setPendingTaskIds((current) => {
      if (isPending) {
        return current.includes(taskId) ? current : [...current, taskId];
      }
      return current.filter((id) => id !== taskId);
    });
  };

  const refreshTasks = useCallback(async () => {
    setTasks(structuredClone(seedTasks));
  }, [seedTasks]);

  const addTask = async (task: TaskDraft) => {
    setIsCreating(true);
    try {
      const now = new Date().toISOString();
      const participantIds = normalizeParticipantIds(userId, task.assigneeUid);
      const denorm = assigneeDenorm(task.assigneeUid);
      const id = `demo-task-${Date.now()}`;

      const next: Task = {
        id,
        text: task.text,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        project: task.project,
        ownerId: userId,
        status: "todo",
        participantIds,
        assigneeUid: task.assigneeUid,
        assigneeDisplayName: denorm.assigneeDisplayName,
        assigneePhotoURL: denorm.assigneePhotoURL,
        createdAt: now,
        updatedAt: now,
      };

      setTasks((prev) => [next, ...prev]);
    } finally {
      setIsCreating(false);
    }
  };

  const updateTask = async (id: string, task: TaskDraft) => {
    setTaskPending(id, true);
    try {
      const now = new Date().toISOString();
      const denorm = assigneeDenorm(task.assigneeUid);

      setTasks((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const ownerId = item.ownerId ?? userId;
          const participantIds = normalizeParticipantIds(
            ownerId,
            task.assigneeUid,
            item.participantIds,
          );
          return {
            ...item,
            text: task.text,
            description: task.description,
            priority: task.priority,
            dueDate: task.dueDate,
            project: task.project,
            participantIds,
            assigneeUid: task.assigneeUid,
            assigneeDisplayName: denorm.assigneeDisplayName,
            assigneePhotoURL: denorm.assigneePhotoURL,
            updatedAt: now,
          };
        }),
      );
    } finally {
      setTaskPending(id, false);
    }
  };

  const deleteTask = async (id: string) => {
    setTaskPending(id, true);
    try {
      setTasks((prev) => prev.filter((item) => item.id !== id));
    } finally {
      setTaskPending(id, false);
    }
  };

  const toggleTask = async (id: string) => {
    setTaskPending(id, true);
    try {
      const now = new Date().toISOString();
      setTasks((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const nextStatus: TaskStatus =
            item.status === "done" ? "todo" : "done";
          return {
            ...item,
            status: nextStatus,
            participantIds: normalizeParticipantIds(
              item.ownerId,
              item.assigneeUid,
              item.participantIds,
            ),
            updatedAt: now,
          };
        }),
      );
    } finally {
      setTaskPending(id, false);
    }
  };

  const setTaskStatus = async (id: string, status: TaskStatus) => {
    setTaskPending(id, true);
    try {
      const now = new Date().toISOString();
      setTasks((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          return {
            ...item,
            status,
            participantIds: normalizeParticipantIds(
              item.ownerId,
              item.assigneeUid,
              item.participantIds,
            ),
            updatedAt: now,
          };
        }),
      );
    } finally {
      setTaskPending(id, false);
    }
  };

  return {
    tasks,
    isLoading: false,
    error: null,
    isCreating,
    pendingTaskIds,
    refreshTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setTaskStatus,
  };
}
