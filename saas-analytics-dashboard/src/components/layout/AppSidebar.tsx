import { NavLink } from "react-router-dom";
import {
  Activity,
  CreditCard,
  LayoutDashboard,
  LineChart,
  Receipt,
  Settings,
  Sparkles,
  Users,
  KanbanSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { paths } from "@/lib/paths";
import { useUiStore } from "@/store/uiStore";
import { useAuth } from "@/hooks/useAuth";
import { useProfileQuery } from "@/hooks/queries/useProfileQuery";
import { canInviteUsers, canManageBilling } from "@/lib/permissions";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const items: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  require?: "billing" | "invite";
}[] = [
  { to: paths.overview, label: "Overview", icon: LayoutDashboard },
  { to: paths.analytics, label: "Analytics", icon: LineChart },
  { to: paths.users, label: "Users", icon: Users, require: "invite" },
  { to: paths.subscriptions, label: "Subscriptions", icon: CreditCard, require: "billing" },
  { to: paths.sales, label: "Sales", icon: Sparkles },
  { to: paths.invoices, label: "Invoices", icon: Receipt, require: "billing" },
  { to: paths.tasks, label: "Tasks", icon: KanbanSquare },
  { to: paths.activity, label: "Activity", icon: Activity },
  { to: paths.settings, label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const { user } = useAuth();
  const profile = useProfileQuery(user?.uid, user?.email ?? undefined);

  const role = profile.data?.role;
  const show = (require?: (typeof items)[number]["require"]) => {
    if (!require) return true;
    if (require === "billing") return canManageBilling(role);
    if (require === "invite") return canInviteUsers(role);
    return true;
  };

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-border bg-card/40 transition-[width] duration-200",
        collapsed ? "w-[72px]" : "w-56",
      )}
    >
        <div className="flex h-14 items-center border-b border-border px-3">
          <div className={cn("font-display text-sm font-semibold", collapsed && "sr-only")}>SaaS Analytics</div>
          {collapsed && <span className="mx-auto font-display text-xs font-bold">SA</span>}
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-2" aria-label="Primary">
          {items
            .filter((i) => show(i.require))
            .map((item) => {
              const link = (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive && "bg-accent text-foreground",
                      collapsed && "justify-center px-0",
                    )
                  }
                  end={item.to === paths.overview}
                >
                  <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
              if (!collapsed) return link;
              return (
                <Tooltip key={item.to}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            })}
        </nav>
    </aside>
  );
}
