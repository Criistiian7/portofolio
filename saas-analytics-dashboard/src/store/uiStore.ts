import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "@/types";

type TableDensity = UserProfile["preferences"]["tableDensity"];

export const useUiStore = create(
  persist<{
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (v: boolean) => void;
    toggleSidebar: () => void;
    commandOpen: boolean;
    setCommandOpen: (v: boolean) => void;
    globalSearch: string;
    setGlobalSearch: (globalSearch: string) => void;
    tableDensity: TableDensity;
    setTableDensity: (d: TableDensity) => void;
  }>(
    (set, get) => ({
      sidebarCollapsed: false,
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
      commandOpen: false,
      setCommandOpen: (commandOpen) => set({ commandOpen }),
      globalSearch: "",
      setGlobalSearch: (globalSearch) => set({ globalSearch }),
      tableDensity: "comfortable",
      setTableDensity: (tableDensity) => set({ tableDensity }),
    }),
    {
      name: "saas-analytics-ui",
      partialize: (s) => ({
        sidebarCollapsed: s.sidebarCollapsed,
        tableDensity: s.tableDensity,
      }),
    },
  ),
);
