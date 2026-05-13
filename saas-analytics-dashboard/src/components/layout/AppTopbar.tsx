import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, Moon, PanelLeftClose, PanelLeft, Search, Sun, Laptop } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/uiStore";
import { useThemeStore, type Theme } from "@/store/themeStore";
import { useAuth } from "@/hooks/useAuth";
import { useProfileQuery } from "@/hooks/queries/useProfileQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { signOutUser } from "@/services/auth";
import { paths } from "@/lib/paths";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { toast } from "sonner";

export function AppTopbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const profile = useProfileQuery(user?.uid, user?.email ?? undefined);
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const globalSearch = useUiStore((s) => s.globalSearch);
  const setGlobalSearch = useUiStore((s) => s.setGlobalSearch);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const debounced = useDebounce(globalSearch, 300);
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = useMemo(() => {
    const n = profile.data?.displayName ?? user?.displayName ?? user?.email ?? "?";
    const parts = n.trim().split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] ?? "?";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
  }, [profile.data?.displayName, user?.displayName, user?.email]);

  const onLogout = async () => {
    await signOutUser();
    toast.success("Signed out");
    navigate(paths.login, { replace: true });
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => toggleSidebar()}
        >
          {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative mx-auto hidden max-w-md flex-1 md:block">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            aria-label="Global search"
            placeholder="Search users, tasks, invoices…"
            className="pl-9"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
          <span className="sr-only" aria-live="polite">
            {debounced.length >= 2 ? `Search updated: ${debounced}` : ""}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Laptop className="h-4 w-4" />
                <span className="hidden text-sm text-muted-foreground sm:inline">Theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Appearance</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as Theme)}>
                <DropdownMenuRadioItem value="light">
                  <Sun className="mr-2 h-4 w-4" /> Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <Moon className="mr-2 h-4 w-4" /> Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  <Laptop className="mr-2 h-4 w-4" /> System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                  {initials.slice(0, 2)}
                </span>
                <span className="hidden max-w-[10rem] truncate text-left text-sm font-medium lg:block">
                  {profile.data?.displayName ?? user?.displayName ?? user?.email}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="font-normal">
                <div className="text-sm font-medium">{profile.data?.displayName ?? user?.displayName}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={paths.settings}>Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => void onLogout()}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden",
          mobileOpen ? "block" : "hidden",
        )}
        role="presentation"
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card shadow-lg transition-transform md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-end border-b border-border px-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => setMobileOpen(false)}>
            Close
          </Button>
        </div>
        <div onClick={() => setMobileOpen(false)}>
          <AppSidebar />
        </div>
      </div>
    </>
  );
}
