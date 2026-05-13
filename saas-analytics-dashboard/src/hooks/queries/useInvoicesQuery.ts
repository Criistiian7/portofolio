import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { listInvoices } from "@/services/firestore/invoicesRepo";

export function useInvoicesQuery(ownerId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.invoices(ownerId ?? ""),
    queryFn: () => listInvoices(ownerId!),
    enabled: Boolean(ownerId),
  });
}
