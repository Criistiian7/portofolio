import { useCallback, useEffect, useRef, useState } from "react";
import { FirebaseError } from "firebase/app";
import { auth, db, firebaseConfigError } from "../firebase/config";
import {
  addDoc,
  deleteDoc,
  getDoc,
  collection,
  onSnapshot,
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
  const [refreshNonce, setRefreshNonce] = useState(0);
  const queryDataRef = useRef<Record<"owner" | "assignee" | "participant", Map<string, Task>>>({
    owner: new Map(),
    assignee: new Map(),
    participant: new Map(),
  });
  const queryStatusRef = useRef<
    Record<"owner" | "assignee" | "participant", { ready: boolean; error: unknown | null }>
  >({
    owner: { ready: false, error: null },
    assignee: { ready: false, error: null },
    participant: { ready: false, error: null },
  });

  const setTaskPending = (taskId: string, isPending: boolean) => {
    setPendingTaskIds((current) => {
      if (isPending) {
        return current.includes(taskId) ? current : [...current, taskId];
      }

      return current.filter((id) => id !== taskId);
    });
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    queryDataRef.current = {
      owner: new Map(),
      assignee: new Map(),
      participant: new Map(),
    };
    queryStatusRef.current = {
      owner: { ready: false, error: null },
      assignee: { ready: false, error: null },
      participant: { ready: false, error: null },
    };

    if (!db) {
      setError(
        firebaseConfigError ??
          "Firebase is not configured. Add your Vite env vars and retry.",
      );
      setIsLoading(false);
      setTasks([]);
      return;
    }

    const emitMergedTasks = () => {
      const byId = new Map<string, Task>();
      for (const source of ["owner", "assignee", "participant"] as const) {
        for (const [id, task] of queryDataRef.current[source]) {
          byId.set(id, task);
        }
      }

      const data = Array.from(byId.values()).sort((first, second) =>
        second.createdAt.localeCompare(first.createdAt),
      );
      setTasks(data);
    };

    const updateQueryState = (
      key: "owner" | "assignee" | "participant",
      nextTasks: Map<string, Task> | null,
      nextError: unknown | null,
    ) => {
      if (nextTasks) {
        queryDataRef.current[key] = nextTasks;
      }

      queryStatusRef.current[key] = {
        ready: true,
        error: nextError,
      };

      emitMergedTasks();

      const statuses = Object.values(queryStatusRef.current);
      const allReady = statuses.every((status) => status.ready);
      const firstError = statuses.find((status) => status.error)?.error ?? null;
      const loadedAny = statuses.some((status) => status.ready && !status.error);

      if (allReady) {
        setIsLoading(false);
      }

      if (!allReady && !loadedAny && firstError) {
        return;
      }

      if (loadedAny) {
        setError(null);
        return;
      }

      if (firstError) {
        setError(
          getErrorMessage(
            firstError,
            "We could not load tasks. Check your Firebase configuration and try again.",
          ),
        );
      }
    };

    const subscribeToQuery = (
      key: "owner" | "assignee" | "participant",
      q: ReturnType<typeof query>,
    ) =>
      onSnapshot(
        q,
        (snapshot) => {
          const next = new Map<string, Task>();
          for (const docSnap of snapshot.docs) {
            const parsed = toTask(docSnap.id, docSnap.data() as TaskFormState);
            if (parsed) {
              next.set(parsed.id, parsed);
            }
          }

          updateQueryState(key, next, null);
        },
        (snapshotError) => {
          updateQueryState(key, new Map(), snapshotError);
        },
      );

    // Keep owner and assignee views live. The third listener catches any older
    // participantIds-only records and cross-user updates without requiring refresh.
    const unsubOwner = subscribeToQuery(
      "owner",
      query(collection(db, "tasks"), where("ownerId", "==", userId)),
    );
    const unsubAssignee = subscribeToQuery(
      "assignee",
      query(collection(db, "tasks"), where("assigneeUid", "==", userId)),
    );
    const unsubParticipant = subscribeToQuery(
      "participant",
      query(collection(db, "tasks"), where("participantIds", "array-contains", userId)),
    );

    return () => {
      unsubOwner();
      unsubAssignee();
      unsubParticipant();
    };
  }, [refreshNonce, userId]);

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
    setRefreshNonce((current) => current + 1);
  }, []);

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
