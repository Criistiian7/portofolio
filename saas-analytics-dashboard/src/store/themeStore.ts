import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

export function applyThemeClass(theme: Theme) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = theme === "dark" || (theme === "system" && prefersDark);
  root.classList.toggle("dark", dark);
}

export const useThemeStore = create(
  persist<{
    theme: Theme;
    setTheme: (t: Theme) => void;
  }>(
    (set) => ({
      theme: "system",
      setTheme: (theme) => {
        set({ theme });
        applyThemeClass(theme);
      },
    }),
    {
      name: "saas-analytics-theme",
    },
  ),
);
