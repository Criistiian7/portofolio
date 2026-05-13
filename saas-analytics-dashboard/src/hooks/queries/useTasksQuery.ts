import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  createTask,
  deleteTask,
  listTasks,
  reorderTasks,
  updateTask,
} from "@/services/firestore/tasksRepo";
import type { Task, TaskStatus } from "@/types";

export function useTasksQuery(ownerId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.tasks(ownerId ?? ""),
    queryFn: () => listTasks(ownerId!),
    enabled: Boolean(ownerId),
  });
}

export function useCreateTaskMutation(ownerId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Task, "id" | "ownerId" | "updatedAt">) => createTask(ownerId!, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.tasks(ownerId ?? "") }),
  });
}

export function useUpdateTaskMutation(ownerId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      id: string;
      patch: Partial<Pick<Task, "title" | "description" | "priority" | "status" | "order">>;
    }) => updateTask(ownerId!, args.id, args.patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.tasks(ownerId ?? "") }),
  });
}

export function useReorderTasksMutation(ownerId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (updates: { id: string; status: TaskStatus; order: number }[]) =>
      reorderTasks(ownerId!, updates),
    onMutate: async (updates) => {
      await qc.cancelQueries({ queryKey: queryKeys.tasks(ownerId ?? "") });
      const prev = qc.getQueryData<Task[]>(queryKeys.tasks(ownerId ?? ""));
      qc.setQueryData<Task[]>(queryKeys.tasks(ownerId ?? ""), (old) => {
        if (!old) return old;
        const map = new Map(updates.map((u) => [u.id, u]));
        return old.map((t) => {
          const u = map.get(t.id);
          if (!u) return t;
          return { ...t, status: u.status, order: u.order, updatedAt: Date.now() };
        });
      });
      return { prev };
    },
    onError: (_e, _u, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKeys.tasks(ownerId ?? ""), ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.tasks(ownerId ?? "") }),
  });
}

export function useDeleteTaskMutation(ownerId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTask(ownerId!, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.tasks(ownerId ?? "") }),
  });
}
