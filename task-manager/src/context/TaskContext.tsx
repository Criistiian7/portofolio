import { createContext, useContext, useState, useEffect } from "react";
import type { Task } from "../types/Task";

type ContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, updated: Partial<Task>) => void;
  reorderTasks: (start: number, end: number) => void;
};

const TaskContext = createContext<ContextType | null>(null);

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("No context");
  return ctx;
};

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, "id">) => {
    setTasks([...tasks, { ...task, id: Date.now().toString() }]);
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const editTask = (id: string, updated: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  };

  const reorderTasks = (start: number, end: number) => {
    const updated = [...tasks];
    const [moved] = updated.splice(start, 1);
    updated.splice(end, 0, moved);
    setTasks(updated);
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, toggleTask, deleteTask, editTask, reorderTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
};
