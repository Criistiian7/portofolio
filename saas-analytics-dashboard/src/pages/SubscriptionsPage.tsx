import { useMemo, type ColumnDef } from "@tanstack/react-table";
import { useAuth } from "@/hooks/useAuth";
import { useSubscriptionsQuery } from "@/hooks/queries/useSubscriptionsQuery";
import type { SubscriptionRow } from "@/types";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const q = useSubscriptionsQuery(user?.uid);
  const rows = q.data ?? [];

  const kpis = useMemo(() => {
    const active = rows.filter((r) => r.status === "active" || r.status === "trialing").length;
    const mrr = rows.reduce((sum, r) => sum + r.mrr, 0);
    const currency = rows[0]?.currency ?? "EUR";
    return { active, mrr, currency, count: rows.length };
  }, [rows]);

  const columns = useMemo<ColumnDef<SubscriptionRow>[]>(
    () => [
      { accessorKey: "plan", header: "Plan" },
      {
        accessorKey: "mrr",
        header: "MRR",
        cell: ({ row }) => `${row.original.currency} ${row.original.mrr.toLocaleString()}`,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge variant="secondary">{row.original.status}</Badge>,
      },
      {
        accessorKey: "renewsAt",
        header: "Renews",
        cell: ({ row }) => new Date(row.original.renewsAt).toLocaleDateString(),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Subscriptions</h1>
        <p className="text-sm text-muted-foreground">Summary cards plus detail table.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {q.isLoading ? (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Combined MRR</CardTitle>
              </CardHeader>
              <CardContent className="font-display text-2xl font-semibold">
                {kpis.currency} {kpis.mrr.toLocaleString()}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active / trialing</CardTitle>
              </CardHeader>
              <CardContent className="font-display text-2xl font-semibold">{kpis.active}</CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Subscriptions</CardTitle>
              </CardHeader>
              <CardContent className="font-display text-2xl font-semibold">{kpis.count}</CardContent>
            </Card>
          </>
        )}
      </div>

      <DataTable data={rows} columns={columns} />
    </div>
  );
}
