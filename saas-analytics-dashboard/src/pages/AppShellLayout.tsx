import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppTopbar } from "@/components/layout/AppTopbar";
import { OnboardingModal } from "@/components/system/OnboardingModal";
import { ShortcutsDialog } from "@/components/system/ShortcutsDialog";
import { PRODUCT_NAME } from "@/brand/constants";

export default function AppShellLayout() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex min-h-dvh w-full">
      <OnboardingModal />
      <ShortcutsDialog />
      <div className="hidden shrink-0 md:flex md:h-dvh">
        <AppSidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main id="main-content" className="flex flex-1 flex-col overflow-hidden" tabIndex={-1}>
          <div className="flex-1 overflow-auto p-4 md:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
          <footer className="shrink-0 border-t border-border bg-background/80 px-4 py-3 text-center text-xs text-muted-foreground backdrop-blur">
            <span className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="font-medium text-foreground/80">{PRODUCT_NAME}</span>
              <a className="underline underline-offset-4 hover:text-foreground" href="#" aria-label="Privacy (placeholder)">
                Privacy
              </a>
              <a className="underline underline-offset-4 hover:text-foreground" href="#" aria-label="Terms (placeholder)">
                Terms
              </a>
              <span className="hidden sm:inline">Replace with real URLs for production (GDPR).</span>
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
