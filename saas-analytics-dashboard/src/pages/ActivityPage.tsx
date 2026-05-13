import { useMemo, type ColumnDef } from "@tanstack/react-table";
import { useAuth } from "@/hooks/useAuth";
import { useActivityQuery } from "@/hooks/queries/useActivityQuery";
import type { ActivityLog } from "@/types";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";

export default function ActivityPage() {
  const { user } = useAuth();
  const q = useActivityQuery(user?.uid);
  const rows = q.data ?? [];

  const columns = useMemo<ColumnDef<ActivityLog>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: "When",
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => <Badge variant="secondary">{row.original.type}</Badge>,
      },
      { accessorKey: "message", header: "Message" },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Activity</h1>
        <p className="text-sm text-muted-foreground">Audit-style feed backed by the `activity` collection.</p>
      </div>
      <DataTable data={rows} columns={columns} />
    </div>
  );
}
