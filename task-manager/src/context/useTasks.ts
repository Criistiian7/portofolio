import { useContext } from "react";
import { TaskContext } from "./taskContext";

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("TaskContext missing");
  return ctx;
};
