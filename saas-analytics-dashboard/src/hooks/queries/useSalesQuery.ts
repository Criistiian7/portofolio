import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { listSales } from "@/services/firestore/salesRepo";

export function useSalesQuery(ownerId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.sales(ownerId ?? ""),
    queryFn: () => listSales(ownerId!),
    enabled: Boolean(ownerId),
  });
}
