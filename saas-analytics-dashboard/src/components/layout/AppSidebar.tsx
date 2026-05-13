import { NavLink } from "react-router-dom";
import {
  Activity,
  BarChart2,
  Bell,
  CircleDollarSign,
  CreditCard,
  KanbanSquare,
  LayoutDashboard,
  LineChart,
  Puzzle,
  Receipt,
  Settings,
  Sparkles,
  Users,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { paths } from "@/lib/paths";
import { useUiStore } from "@/store/uiStore";
import { useAuth } from "@/hooks/useAuth";
import { useProfileQuery } from "@/hooks/queries/useProfileQuery";
import { canInviteUsers, canManageBilling } from "@/lib/permissions";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MetricFlowLogo } from "@/brand/MetricFlowLogo";
import { Link } from "react-router-dom";

type Item = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  require?: "billing" | "invite";
};

const primaryItems: Item[] = [
  { to: paths.overview, label: "Dashboard", icon: LayoutDashboard },
  { to: paths.analytics, label: "Analytics", icon: LineChart },
  { to: paths.revenue, label: "Revenue", icon: CircleDollarSign },
  { to: paths.customers, label: "Customers", icon: Users, require: "invite" },
  { to: paths.subscriptions, label: "Subscriptions", icon: CreditCard, require: "billing" },
  { to: paths.reports, label: "Reports", icon: BarChart2 },
  { to: paths.insights, label: "AI Insights", icon: Sparkles },
  { to: paths.notifications, label: "Notifications", icon: Bell },
  { to: paths.integrations, label: "Integrations", icon: Puzzle },
  { to: paths.team, label: "Team", icon: UsersRound, require: "invite" },
  { to: paths.settings, label: "Settings", icon: Settings },
];

const operationsItems: Item[] = [
  { to: paths.tasks, label: "Tasks", icon: KanbanSquare },
  { to: paths.activity, label: "Activity", icon: Activity },
  { to: paths.invoices, label: "Invoices", icon: Receipt, require: "billing" },
];

function NavItems({
  items,
  collapsed,
  show,
}: {
  items: Item[];
  collapsed: boolean;
  show: (require?: Item["require"]) => boolean;
}) {
  return (
    <>
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
    </>
  );
}

export function AppSidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const { user } = useAuth();
  const profile = useProfileQuery(user?.uid, user?.email ?? undefined);

  const role = profile.data?.role;
  const show = (require?: Item["require"]) => {
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
        <Link
          to={paths.overview}
          className={cn(
            "flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            collapsed && "justify-center",
          )}
          aria-label="MetricFlow dashboard home"
        >
          <MetricFlowLogo variant="mark" className="h-8 w-8 shrink-0" />
          {!collapsed && <span className="truncate font-display text-sm font-semibold tracking-tight">MetricFlow</span>}
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2" aria-label="Primary">
        <NavItems items={primaryItems} collapsed={collapsed} show={show} />
        <div className={cn("px-2 pt-3", collapsed && "px-0")}>
          <p className={cn("text-2xs font-semibold uppercase tracking-wider text-muted-foreground", collapsed && "sr-only")}>
            Operations
          </p>
        </div>
        <NavItems items={operationsItems} collapsed={collapsed} show={show} />
      </nav>
    </aside>
  );
}
