import type { Task } from "../types/Task";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getTasks = async (): Promise<Task[]> => {
  await delay(300);
  return JSON.parse(localStorage.getItem("tasks") || "[]");
};

export const saveTasks = async (tasks: Task[]) => {
  await delay(200);
  localStorage.setItem("tasks", JSON.stringify(tasks));
};
