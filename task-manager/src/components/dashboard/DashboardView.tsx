import { useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { useTasks } from "../../context/useTasks";
import type { Task } from "../../types/Task";
import { isTaskDone } from "../../types/Task";
import { DashboardLayout } from "../layout/AppShell";
import TopNav from "../layout/TopNav";
import Sidebar from "../layout/Sidebar";
import DashboardHeader from "./DashboardHeader";
import MetricsRow from "./MetricsRow";
import FilterTabs, { type StatusTab } from "./FilterTabs";
import TaskTable from "./TaskTable";
import RecentlyCompleted from "./RecentlyCompleted";

type Props = {
  user: User;
  dark: boolean;
  onToggleTheme: () => void;
  onSignOut: () => void;
};

function applyFilters(
  tasks: Task[],
  searchQuery: string,
  projectFilter: string | null,
  statusTab: StatusTab,
) {
  let list = tasks;

  if (projectFilter) {
    list = list.filter((task) => task.project === projectFilter);
  }

  if (statusTab !== "all") {
    list = list.filter((task) => task.status === statusTab);
  }

  const trimmed = searchQuery.trim().toLowerCase();
  if (trimmed) {
    list = list.filter((task) => {
      const hay = `${task.text} ${task.description}`.toLowerCase();
      return hay.includes(trimmed);
    });
  }

  return list;
}

export default function DashboardView({
  user,
  dark,
  onToggleTheme,
  onSignOut,
}: Props) {
  const { tasks, isLoading, error, refreshTasks } = useTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const [statusTab, setStatusTab] = useState<StatusTab>("all");

  const workspaceTitle = `${user.displayName?.trim() || user.email || "Your"} workspace`;

  const filtered = useMemo(
    () => applyFilters(tasks, searchQuery, projectFilter, statusTab),
    [tasks, searchQuery, projectFilter, statusTab],
  );

  const completedForRecent = useMemo(() => {
    return applyFilters(tasks, searchQuery, projectFilter, "all").filter((task) =>
      isTaskDone(task),
    );
  }, [tasks, searchQuery, projectFilter]);

  const tableTasks = useMemo(() => {
    if (statusTab === "done") {
      return filtered;
    }

    return filtered.filter((task) => !isTaskDone(task));
  }, [filtered, statusTab]);

  if (isLoading) {
    return (
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
          Loading
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-white">
          Fetching your workspace…
        </h2>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <TopNav
        user={user}
        workspaceTitle={workspaceTitle}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSignOut={onSignOut}
      />

      {error ? (
        <div className="rounded-[2rem] border border-rose-400/20 bg-rose-500/10 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-200">
            Sync issue
          </p>
          <h2 className="mt-3 text-xl font-semibold text-white">{error}</h2>
          <button
            type="button"
            className="mt-5 inline-flex items-center justify-center rounded-2xl bg-rose-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-rose-300"
            onClick={() => void refreshTasks()}
          >
            Retry
          </button>
        </div>
      ) : null}

      <DashboardLayout
        sidebar={
          <Sidebar
            userId={user.uid}
            userEmail={user.email}
            projectFilter={projectFilter}
            onProjectFilterChange={setProjectFilter}
          />
        }
      >
        <DashboardHeader dark={dark} onToggleTheme={onToggleTheme} />
        <MetricsRow />
        <FilterTabs value={statusTab} onChange={setStatusTab} />

        {statusTab === "done" ? (
          <RecentlyCompleted tasks={tableTasks} />
        ) : (
          <>
            <TaskTable tasks={tableTasks} userId={user.uid} />
            <RecentlyCompleted tasks={completedForRecent} />
          </>
        )}
      </DashboardLayout>
    </div>
  );
}
