import { useMemo, type ColumnDef } from "@tanstack/react-table";
import { Activity } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useActivityQuery } from "@/hooks/queries/useActivityQuery";
import type { ActivityLog } from "@/types";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";
import { DocumentTitle } from "@/components/system/DocumentTitle";
import { EmptyState } from "@/components/system/EmptyState";
import { PRODUCT_NAME } from "@/brand/constants";

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
      <DocumentTitle title={`Activity — ${PRODUCT_NAME}`} />
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Activity</h1>
        <p className="text-sm text-muted-foreground">Audit-style feed backed by the `activity` collection.</p>
      </div>
      {q.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading activity…</p>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No activity yet"
          description="Create tasks or invoices to generate events, or stay in mock mode to use seeded rows."
        />
      ) : (
        <DataTable data={rows} columns={columns} />
      )}
    </div>
  );
}
