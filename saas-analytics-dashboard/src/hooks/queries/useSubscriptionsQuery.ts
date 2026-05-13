import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { listSubscriptions } from "@/services/firestore/subscriptionsRepo";

export function useSubscriptionsQuery(ownerId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.subscriptions(ownerId ?? ""),
    queryFn: () => listSubscriptions(ownerId!),
    enabled: Boolean(ownerId),
  });
}
