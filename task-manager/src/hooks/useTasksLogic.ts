import { useCallback, useState } from "react";
import { FirebaseError } from "firebase/app";
import { auth, db, firebaseConfigError } from "../firebase/config";
import {
  addDoc,
  deleteDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import type { Task, TaskDraft, TaskPriority, TaskStatus } from "../types/Task";

type TaskFormState = {
  text?: unknown;
  description?: unknown;
  category?: unknown;
  project?: unknown;
  priority?: unknown;
  ownerId?: unknown;
  completed?: unknown;
  status?: unknown;
  dueDate?: unknown;
  participantIds?: unknown;
  assigneeUid?: unknown;
  assigneeDisplayName?: unknown;
  assigneePhotoURL?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const isTaskPriority = (value: unknown): value is TaskPriority =>
  value === "low" || value === "medium" || value === "high";

const isTaskStatus = (value: unknown): value is TaskStatus =>
  value === "todo" || value === "in_progress" || value === "done";

const normalizeParticipantIds = (
  ownerId: string,
  assigneeUid: string | null,
  existing?: unknown,
): string[] => {
  const fromExisting =
    Array.isArray(existing) && existing.every((id) => typeof id === "string")
      ? (existing as string[])
      : null;

  const merged = new Set<string>([ownerId]);
  if (assigneeUid) merged.add(assigneeUid);
  if (fromExisting) {
    for (const id of fromExisting) merged.add(id);
  }

  return Array.from(merged);
};

const toTask = (id: string, value: TaskFormState): Task | null => {
  if (
    typeof value.text !== "string" ||
    typeof value.description !== "string" ||
    typeof value.ownerId !== "string" ||
    typeof value.createdAt !== "string" ||
    typeof value.updatedAt !== "string" ||
    !isTaskPriority(value.priority)
  ) {
    return null;
  }

  const projectSource =
    typeof value.project === "string" && value.project.trim()
      ? value.project.trim()
      : typeof value.category === "string" && value.category.trim()
        ? value.category.trim()
        : "General";

  let status: TaskStatus;
  if (isTaskStatus(value.status)) {
    status = value.status;
  } else if (value.completed === true) {
    status = "done";
  } else if (value.completed === false || value.completed === undefined) {
    status = "todo";
  } else {
    return null;
  }

  const assigneeUid =
    value.assigneeUid === null || typeof value.assigneeUid === "string"
      ? (value.assigneeUid as string | null)
      : null;

  const participantIds = normalizeParticipantIds(
    value.ownerId,
    assigneeUid,
    value.participantIds,
  );

  const dueDate =
    value.dueDate === null || typeof value.dueDate === "string"
      ? (value.dueDate as string | null)
      : null;

  return {
    id,
    text: value.text,
    description: value.description,
    priority: value.priority,
    dueDate,
    project: projectSource,
    ownerId: value.ownerId,
    status,
    participantIds,
    assigneeUid,
    assigneeDisplayName:
      value.assigneeDisplayName === null ||
      typeof value.assigneeDisplayName === "string"
        ? (value.assigneeDisplayName as string | null | undefined) ?? null
        : null,
    assigneePhotoURL:
      value.assigneePhotoURL === null || typeof value.assigneePhotoURL === "string"
        ? (value.assigneePhotoURL as string | null | undefined) ?? null
        : null,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "permission-denied":
        return "Firestore denied read access to tasks. In the Firebase console, publish the rules from task-manager/firestore.rules (reads must allow both ownerId matches and participantIds array-contains for assignees).";
      case "unavailable":
        return "Firestore is currently unavailable. Retry when your connection stabilizes.";
      case "failed-precondition":
        return "Firestore needs an index or a setup step before this query can succeed.";
      case "unauthenticated":
        return "Your authenticated session is missing or expired. Sign in again and retry.";
      default:
        return error.message || fallback;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

const fetchAssigneeDenorm = async (
  assigneeUid: string | null,
): Promise<{ assigneeDisplayName: string | null; assigneePhotoURL: string | null }> => {
  if (!db || !assigneeUid) {
    return { assigneeDisplayName: null, assigneePhotoURL: null };
  }

  try {
    const snap = await getDoc(doc(db, "users", assigneeUid));
    if (!snap.exists()) {
      return { assigneeDisplayName: null, assigneePhotoURL: null };
    }

    const data = snap.data() as Record<string, unknown>;
    const displayName =
      typeof data.displayName === "string" ? data.displayName : null;
    const photoURL = typeof data.photoURL === "string" ? data.photoURL : null;

    return { assigneeDisplayName: displayName, assigneePhotoURL: photoURL };
  } catch {
    return { assigneeDisplayName: null, assigneePhotoURL: null };
  }
};

export const useTasksLogic = (userId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const fetchTasks = useCallback(
    async (showLoading = true) => {
      if (showLoading) {
        setIsLoading(true);
      }

      setError(null);

      if (!db) {
        setError(
          firebaseConfigError ??
            "Firebase is not configured. Add your Vite env vars and retry.",
        );
        if (showLoading) {
          setIsLoading(false);
        }
        return;
      }

      try {
        // Load tasks by ownerId and assigneeUid — these equality queries align cleanly
        // with Firestore security rules (isParticipant). Avoid relying on
        // participantIds array-contains as the primary path: some projects see
        // permission-denied on that query even when rules look correct.
        // Optional third query catches extra participantIds (e.g. legacy data); ignored if it fails.
        const [ownerResult, assigneeResult, participantArrayResult] =
          await Promise.allSettled([
            getDocs(
              query(collection(db, "tasks"), where("ownerId", "==", userId)),
            ),
            getDocs(
              query(
                collection(db, "tasks"),
                where("assigneeUid", "==", userId),
              ),
            ),
            getDocs(
              query(
                collection(db, "tasks"),
                where("participantIds", "array-contains", userId),
              ),
            ),
          ]);

        const byId = new Map<string, Task>();

        for (const result of [
          ownerResult,
          assigneeResult,
          participantArrayResult,
        ]) {
          if (result.status !== "fulfilled") {
            continue;
          }
          for (const docSnap of result.value.docs) {
            const parsed = toTask(docSnap.id, docSnap.data() as TaskFormState);
            if (parsed) {
              byId.set(parsed.id, parsed);
            }
          }
        }

        const loadedAny =
          ownerResult.status === "fulfilled" ||
          assigneeResult.status === "fulfilled" ||
          participantArrayResult.status === "fulfilled";

        if (!loadedAny) {
          const firstError =
            ownerResult.status === "rejected"
              ? ownerResult.reason
              : assigneeResult.status === "rejected"
                ? assigneeResult.reason
                : participantArrayResult.reason;
          setError(
            getErrorMessage(
              firstError,
              "We could not load tasks. Check your Firebase configuration and try again.",
            ),
          );
        } else {
          setError(null);
        }

        const data = Array.from(byId.values()).sort((first, second) =>
          second.createdAt.localeCompare(first.createdAt),
        );

        setTasks(data);
      } catch (fetchError) {
        setError(
          getErrorMessage(
            fetchError,
            "We could not load tasks. Check your Firebase configuration and try again.",
          ),
        );
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    },
    [userId],
  );

  const addTask = async (task: TaskDraft) => {
    if (!db) {
      const configError =
        firebaseConfigError ??
        "Firebase is not configured. Add your Vite env vars and retry.";
      setError(configError);
      throw new Error(configError);
    }

    const now = new Date().toISOString();
    const currentUserId = auth?.currentUser?.uid;

    if (!currentUserId) {
      const authError = "You must be signed in before creating tasks.";
      setError(authError);
      throw new Error(authError);
    }

    setIsCreating(true);
    setError(null);

    try {
      const participantIds = normalizeParticipantIds(
        currentUserId,
        task.assigneeUid,
      );
      const denorm = await fetchAssigneeDenorm(task.assigneeUid);

      await addDoc(collection(db, "tasks"), {
        text: task.text,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        project: task.project,
        ownerId: currentUserId,
        status: "todo" as TaskStatus,
        participantIds,
        assigneeUid: task.assigneeUid,
        assigneeDisplayName: denorm.assigneeDisplayName,
        assigneePhotoURL: denorm.assigneePhotoURL,
        createdAt: now,
        updatedAt: now,
      });
      await fetchTasks(false);
    } catch (createError) {
      setError(
        getErrorMessage(
          createError,
          "We could not create that task. Please retry in a moment.",
        ),
      );
      throw createError;
    } finally {
      setIsCreating(false);
    }
  };

  const updateTask = async (id: string, task: TaskDraft) => {
    if (!db) {
      const configError =
        firebaseConfigError ??
        "Firebase is not configured. Add your Vite env vars and retry.";
      setError(configError);
      throw new Error(configError);
    }

    const currentUserId = auth?.currentUser?.uid;
    if (!currentUserId) {
      const authError = "You must be signed in before updating tasks.";
      setError(authError);
      throw new Error(authError);
    }

    const existing = tasks.find((item) => item.id === id);
    const ownerId = existing?.ownerId ?? currentUserId;

    setTaskPending(id, true);
    setError(null);

    try {
      const participantIds = normalizeParticipantIds(ownerId, task.assigneeUid);
      const denorm = await fetchAssigneeDenorm(task.assigneeUid);

      await updateDoc(doc(db, "tasks", id), {
        text: task.text,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        project: task.project,
        participantIds,
        assigneeUid: task.assigneeUid,
        assigneeDisplayName: denorm.assigneeDisplayName,
        assigneePhotoURL: denorm.assigneePhotoURL,
        updatedAt: new Date().toISOString(),
      });
      await fetchTasks(false);
    } catch (updateError) {
      setError(
        getErrorMessage(
          updateError,
          "We could not save your changes. Please retry in a moment.",
        ),
      );
      throw updateError;
    } finally {
      setTaskPending(id, false);
    }
  };

  const deleteTask = async (id: string) => {
    if (!db) {
      const configError =
        firebaseConfigError ??
        "Firebase is not configured. Add your Vite env vars and retry.";
      setError(configError);
      throw new Error(configError);
    }

    setTaskPending(id, true);
    setError(null);

    try {
      await deleteDoc(doc(db, "tasks", id));
      await fetchTasks(false);
    } catch (deleteError) {
      setError(
        getErrorMessage(
          deleteError,
          "We could not delete that task. Please retry in a moment.",
        ),
      );
      throw deleteError;
    } finally {
      setTaskPending(id, false);
    }
  };

  const toggleTask = async (id: string) => {
    if (!db) {
      const configError =
        firebaseConfigError ??
        "Firebase is not configured. Add your Vite env vars and retry.";
      setError(configError);
      throw new Error(configError);
    }

    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    setTaskPending(id, true);
    setError(null);

    const nextStatus: TaskStatus = task.status === "done" ? "todo" : "done";

    try {
      await updateDoc(doc(db, "tasks", id), {
        status: nextStatus,
        participantIds: normalizeParticipantIds(task.ownerId, task.assigneeUid),
        updatedAt: new Date().toISOString(),
      });
      await fetchTasks(false);
    } catch (toggleError) {
      setError(
        getErrorMessage(
          toggleError,
          "We could not update that task. Please retry in a moment.",
        ),
      );
      throw toggleError;
    } finally {
      setTaskPending(id, false);
    }
  };

  const setTaskStatus = async (id: string, status: TaskStatus) => {
    if (!db) {
      const configError =
        firebaseConfigError ??
        "Firebase is not configured. Add your Vite env vars and retry.";
      setError(configError);
      throw new Error(configError);
    }

    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    setTaskPending(id, true);
    setError(null);

    try {
      await updateDoc(doc(db, "tasks", id), {
        status,
        participantIds: normalizeParticipantIds(task.ownerId, task.assigneeUid),
        updatedAt: new Date().toISOString(),
      });
      await fetchTasks(false);
    } catch (err) {
      setError(
        getErrorMessage(err, "We could not update that task. Please retry in a moment."),
      );
      throw err;
    } finally {
      setTaskPending(id, false);
    }
  };

  const refreshTasks = useCallback(async () => {
    await fetchTasks(true);
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    isCreating,
    pendingTaskIds,
    refreshTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setTaskStatus,
  };
};
