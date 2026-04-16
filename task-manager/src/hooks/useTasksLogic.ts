import { useCallback, useState } from "react";
import { FirebaseError } from "firebase/app";
import { auth, db, firebaseConfigError } from "../firebase/config";
import {
  addDoc,
  deleteDoc,
  getDocs,
  collection,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import type { Task, TaskDraft, TaskPriority } from "../types/Task";

type TaskFormState = {
  text?: unknown;
  description?: unknown;
  category?: unknown;
  priority?: unknown;
  ownerId?: unknown;
  completed?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const isTaskPriority = (value: unknown): value is TaskPriority =>
  value === "low" || value === "medium" || value === "high";

const toTask = (id: string, value: TaskFormState): Task | null => {
  if (
    typeof value.text !== "string" ||
    typeof value.description !== "string" ||
    typeof value.category !== "string" ||
    typeof value.ownerId !== "string" ||
    typeof value.completed !== "boolean" ||
    typeof value.createdAt !== "string" ||
    typeof value.updatedAt !== "string" ||
    !isTaskPriority(value.priority)
  ) {
    return null;
  }

  return {
    id,
    text: value.text,
    description: value.description,
    category: value.category,
    priority: value.priority,
    ownerId: value.ownerId,
    completed: value.completed,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "permission-denied":
        return "Firestore denied this request. Check that your security rules only allow access to the signed-in user's tasks.";
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

export const useTasksLogic = (ownerId: string) => {
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
        const snapshot = await getDocs(
          query(collection(db, "tasks"), where("ownerId", "==", ownerId)),
        );

        const data = snapshot.docs
          .map((item) => toTask(item.id, item.data() as TaskFormState))
          .filter((task): task is Task => task !== null)
          .sort((first, second) => second.createdAt.localeCompare(first.createdAt));

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
    [ownerId],
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
      await addDoc(collection(db, "tasks"), {
        ...task,
        ownerId: currentUserId,
        completed: false,
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

    setTaskPending(id, true);
    setError(null);

    try {
      await updateDoc(doc(db, "tasks", id), {
        ...task,
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

    try {
      await updateDoc(doc(db, "tasks", id), {
        completed: !task.completed,
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
  };
};
