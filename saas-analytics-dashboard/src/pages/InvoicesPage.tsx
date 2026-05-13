import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Download, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useInvoicesQuery } from "@/hooks/queries/useInvoicesQuery";
import { useUiStore } from "@/store/uiStore";
import { exportToCsv } from "@/utils/csv";
import type { Invoice } from "@/types";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function InvoicesPage() {
  const { user } = useAuth();
  const q = useInvoicesQuery(user?.uid);
  const globalSearch = useUiStore((s) => s.globalSearch);
  const [selected, setSelected] = useState<Invoice | null>(null);

  const rows = useMemo(() => {
    const data = q.data ?? [];
    const g = globalSearch.trim().toLowerCase();
    if (g.length < 2) return data;
    return data.filter(
      (r) =>
        r.customer.toLowerCase().includes(g) ||
        r.id.toLowerCase().includes(g) ||
        r.status.toLowerCase().includes(g),
    );
  }, [q.data, globalSearch]);

  const columns = useMemo<ColumnDef<Invoice>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "customer", header: "Customer" },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => `${row.original.currency} ${row.original.amount.toLocaleString()}`,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge variant="secondary">{row.original.status}</Badge>,
      },
      {
        accessorKey: "issuedAt",
        header: "Issued",
        cell: ({ row }) => new Date(row.original.issuedAt).toLocaleDateString(),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Row actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelected(row.original)}>View</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  exportToCsv([row.original], [
                    { key: "id", header: "ID" },
                    { key: "customer", header: "Customer" },
                    { key: "amount", header: "Amount" },
                    { key: "currency", header: "Currency" },
                    { key: "status", header: "Status" },
                    { key: "issuedAt", header: "IssuedAt" },
                  ], `invoice-${row.original.id}.csv`)
                }
              >
                Export row
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Invoices</h1>
        <p className="text-sm text-muted-foreground">PDF download can swap in behind the same modal action.</p>
      </div>
      <DataTable
        data={rows}
        columns={columns}
        toolbar={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              exportToCsv(rows, [
                { key: "id", header: "ID" },
                { key: "customer", header: "Customer" },
                { key: "amount", header: "Amount" },
                { key: "currency", header: "Currency" },
                { key: "status", header: "Status" },
                { key: "issuedAt", header: "IssuedAt" },
              ], "invoices.csv")
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      <Dialog open={Boolean(selected)} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invoice {selected?.id}</DialogTitle>
            <DialogDescription>{selected?.customer}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span>
                {selected?.currency} {selected?.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge>{selected?.status}</Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
