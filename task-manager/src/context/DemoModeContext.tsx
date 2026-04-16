import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  DEMO_CONTACT_UIDS,
  DEMO_LABELS,
} from "../demo/constants";

export type DemoModeState =
  | { isDemo: false }
  | {
      isDemo: true;
      demoContactUids: readonly string[];
      demoLabels: Record<string, string>;
    };

const DemoModeContext = createContext<DemoModeState>({ isDemo: false });

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const value = useMemo<DemoModeState>(
    () => ({
      isDemo: true,
      demoContactUids: DEMO_CONTACT_UIDS,
      demoLabels: DEMO_LABELS,
    }),
    [],
  );

  return (
    <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>
  );
}

export function useDemoMode(): DemoModeState {
  return useContext(DemoModeContext);
}
