import { useEffect, useState } from "react";
import { DemoModeProvider } from "../context/DemoModeContext";
import { DemoTaskProvider } from "../context/DemoTaskProvider";
import { DEMO_USER } from "../demo/constants";
import DashboardView from "./dashboard/DashboardView";
import AppShell from "./layout/AppShell";

type Props = {
  onExitDemo: () => void;
};

export default function DemoApp({ onExitDemo }: Props) {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <DemoModeProvider>
      <DemoTaskProvider>
        <AppShell>
          <DashboardView
            user={DEMO_USER}
            dark={dark}
            onToggleTheme={() => setDark((current) => !current)}
            onSignOut={onExitDemo}
            isDemo
          />
        </AppShell>
      </DemoTaskProvider>
    </DemoModeProvider>
  );
}
