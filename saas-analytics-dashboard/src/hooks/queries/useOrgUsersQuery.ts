import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { listOrgUsers } from "@/services/firestore/orgUsersRepo";

export function useOrgUsersQuery(ownerId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users(ownerId ?? ""),
    queryFn: () => listOrgUsers(ownerId!),
    enabled: Boolean(ownerId),
  });
}
