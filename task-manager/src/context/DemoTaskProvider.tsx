import { type ReactNode } from "react";
import { useDemoTasksLogic } from "../hooks/useDemoTasksLogic";
import { DEMO_UID } from "../demo/constants";
import { TaskContext } from "./taskContext";

export function DemoTaskProvider({ children }: { children: ReactNode }) {
  const {
    tasks,
    isLoading,
    error,
    isCreating,
    refreshTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setTaskStatus,
    pendingTaskIds,
  } = useDemoTasksLogic(DEMO_UID);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        error,
        isCreating,
        refreshTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        setTaskStatus,
        isTaskPending: (id: string) => pendingTaskIds.includes(id),
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
