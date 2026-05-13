import { useMemo, type ColumnDef } from "@tanstack/react-table";
import { useAuth } from "@/hooks/useAuth";
import { useSalesQuery } from "@/hooks/queries/useSalesQuery";
import type { SaleRow } from "@/types";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";

export default function SalesPage() {
  const { user } = useAuth();
  const q = useSalesQuery(user?.uid);
  const rows = q.data ?? [];

  const columns = useMemo<ColumnDef<SaleRow>[]>(
    () => [
      { accessorKey: "name", header: "Deal" },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => `${row.original.currency} ${row.original.amount.toLocaleString()}`,
      },
      {
        accessorKey: "stage",
        header: "Stage",
        cell: ({ row }) => <Badge variant="outline">{row.original.stage}</Badge>,
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Sales</h1>
        <p className="text-sm text-muted-foreground">Pipeline snapshot for your workspace.</p>
      </div>
      <DataTable data={rows} columns={columns} />
    </div>
  );
}
