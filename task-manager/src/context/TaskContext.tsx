import { createContext, useContext, useEffect, useState } from "react";
import type { Task } from "../types/Task";
import { getTasks, saveTasks } from "../services/taskService";

type ContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, text: string) => void;
  toggleSelect: (id: string) => void;
  selectAll: () => void;
  deleteSelected: () => void;
};

const TaskContext = createContext<ContextType | null>(null);

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("No context");
  return ctx;
};

export const TaskProvider = ({ children }: any) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks().then(setTasks);
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (task: Omit<Task, "id">) => {
    setTasks([
      ...tasks,
      { ...task, id: Date.now().toString(), selected: false },
    ]);
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const editTask = (id: string, text: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, text } : t)));
  };

  const toggleSelect = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t)),
    );
  };

  const selectAll = () => {
    setTasks(tasks.map((t) => ({ ...t, selected: true })));
  };

  const deleteSelected = () => {
    setTasks(tasks.filter((t) => !t.selected));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        editTask,
        toggleSelect,
        selectAll,
        deleteSelected,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
