import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Download, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useOrgUsersQuery } from "@/hooks/queries/useOrgUsersQuery";
import { useUiStore } from "@/store/uiStore";
import { exportToCsv } from "@/utils/csv";
import type { OrgUser } from "@/types";
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

export default function UsersPage() {
  const { user } = useAuth();
  const q = useOrgUsersQuery(user?.uid);
  const globalSearch = useUiStore((s) => s.globalSearch);
  const [selected, setSelected] = useState<OrgUser | null>(null);

  const rows = useMemo(() => {
    const data = q.data ?? [];
    const g = globalSearch.trim().toLowerCase();
    if (g.length < 2) return data;
    return data.filter(
      (r) =>
        r.name.toLowerCase().includes(g) ||
        r.email.toLowerCase().includes(g) ||
        r.role.toLowerCase().includes(g),
    );
  }, [q.data, globalSearch]);

  const columns = useMemo<ColumnDef<OrgUser>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => <Badge variant="secondary">{row.original.role}</Badge>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge variant="outline">{row.original.status}</Badge>,
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
              <DropdownMenuItem onClick={() => setSelected(row.original)}>View profile</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  exportToCsv([row.original], [
                    { key: "name", header: "Name" },
                    { key: "email", header: "Email" },
                    { key: "role", header: "Role" },
                    { key: "status", header: "Status" },
                  ], `user-${row.original.id}.csv`)
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
        <h1 className="font-display text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">Directory rows stored in `orgUsers` with `ownerId`.</p>
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
                { key: "name", header: "Name" },
                { key: "email", header: "Email" },
                { key: "role", header: "Role" },
                { key: "status", header: "Status" },
              ], "users.csv")
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
            <DialogTitle>{selected?.name}</DialogTitle>
            <DialogDescription>{selected?.email}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap gap-2">
            <Badge>{selected?.role}</Badge>
            <Badge variant="outline">{selected?.status}</Badge>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
