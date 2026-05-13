import { useLayoutEffect } from "react";
import { applyThemeClass, useThemeStore } from "@/store/themeStore";

/** Applies persisted theme and reacts to system preference while theme is `system`. */
export function ThemeBridge() {
  const theme = useThemeStore((s) => s.theme);

  useLayoutEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  useLayoutEffect(() => {
    const unsub = useThemeStore.persist.onFinishHydration(() => {
      applyThemeClass(useThemeStore.getState().theme);
    });
    return unsub;
  }, []);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (useThemeStore.getState().theme === "system") {
        applyThemeClass("system");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return null;
}
