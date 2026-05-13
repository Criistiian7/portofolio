import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
} from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";
import { isMockMode } from "@/env";
import type { Task, TaskPriority, TaskStatus } from "@/types";
import {
  mockListTasks,
  mockSetOwnerTasks,
  mockUpdateTaskOrder,
} from "@/services/mock/mockData";

function mapTask(id: string, data: DocumentData): Task {
  return {
    id,
    ownerId: String(data.ownerId),
    title: String(data.title),
    description: String(data.description ?? ""),
    priority: data.priority as TaskPriority,
    status: data.status as TaskStatus,
    order: Number(data.order ?? 0),
    updatedAt: Number(data.updatedAt ?? 0),
  };
}

export async function listTasks(ownerId: string): Promise<Task[]> {
  if (isMockMode) {
    return mockListTasks(ownerId);
  }
  const db = getFirestoreDb();
  const q = query(collection(db, "tasks"), where("ownerId", "==", ownerId));
  const snap = await getDocs(q);
  const rows = snap.docs.map((d) => mapTask(d.id, d.data()));
  return rows.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function createTask(
  ownerId: string,
  input: Omit<Task, "id" | "ownerId" | "updatedAt">,
): Promise<Task> {
  if (isMockMode) {
    const list = mockListTasks(ownerId);
    const id = `t_${crypto.randomUUID().slice(0, 8)}`;
    const task: Task = {
      ...input,
      id,
      ownerId,
      updatedAt: Date.now(),
    };
    mockSetOwnerTasks(ownerId, [task, ...list]);
    return task;
  }
  const db = getFirestoreDb();
  const ref = doc(collection(db, "tasks"));
  const task: Task = {
    ...input,
    id: ref.id,
    ownerId,
    updatedAt: Date.now(),
  };
  await setDoc(ref, {
    ownerId: task.ownerId,
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    order: task.order,
    updatedAt: task.updatedAt,
  });
  return task;
}

export async function updateTask(
  ownerId: string,
  id: string,
  patch: Partial<Pick<Task, "title" | "description" | "priority" | "status" | "order">>,
): Promise<void> {
  if (isMockMode) {
    const list = mockListTasks(ownerId);
    const next = list.map((t) =>
      t.id === id && t.ownerId === ownerId
        ? { ...t, ...patch, updatedAt: Date.now() }
        : t,
    );
    mockSetOwnerTasks(ownerId, next);
    return;
  }
  const db = getFirestoreDb();
  const ref = doc(db, "tasks", id);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data()?.ownerId !== ownerId) {
    throw new Error("Task not found");
  }
  await updateDoc(ref, {
    ...patch,
    updatedAt: Date.now(),
  });
}

export async function reorderTasks(
  ownerId: string,
  updates: { id: string; status: TaskStatus; order: number }[],
): Promise<void> {
  if (isMockMode) {
    mockUpdateTaskOrder(ownerId, updates);
    return;
  }
  const db = getFirestoreDb();
  const batch = writeBatch(db);
  const now = Date.now();
  for (const u of updates) {
    const ref = doc(db, "tasks", u.id);
    batch.update(ref, { status: u.status, order: u.order, updatedAt: now });
  }
  await batch.commit();
}

export async function deleteTask(ownerId: string, id: string): Promise<void> {
  if (isMockMode) {
    const list = mockListTasks(ownerId).filter((t) => t.id !== id);
    mockSetOwnerTasks(ownerId, list);
    return;
  }
  const db = getFirestoreDb();
  const ref = doc(db, "tasks", id);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data()?.ownerId !== ownerId) {
    throw new Error("Task not found");
  }
  await deleteDoc(ref);
}
