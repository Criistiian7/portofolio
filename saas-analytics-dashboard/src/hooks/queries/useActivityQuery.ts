import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { listActivity } from "@/services/firestore/activityRepo";

export function useActivityQuery(ownerId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.activity(ownerId ?? ""),
    queryFn: () => listActivity(ownerId!),
    enabled: Boolean(ownerId),
  });
}
