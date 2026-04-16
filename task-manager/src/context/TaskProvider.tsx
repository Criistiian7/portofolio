import { type ReactNode } from "react";
import { useTasksLogic } from "../hooks/useTasksLogic";
import { TaskContext } from "./taskContext";

export const TaskProvider = ({
  children,
  userId,
}: {
  children: ReactNode;
  userId: string;
}) => {
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
  } = useTasksLogic(userId);

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
};
