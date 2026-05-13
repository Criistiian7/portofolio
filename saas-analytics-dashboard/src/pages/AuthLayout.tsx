import { Suspense } from "react";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import { PRODUCT_NAME, PRODUCT_TAGLINE } from "@/brand/constants";
import { MetricFlowLogo } from "@/brand/MetricFlowLogo";
import { FullPageSkeleton } from "@/components/system/FullPageSkeleton";
import { FloatingOrbs } from "@/components/motion/FloatingOrbs";

export default function AuthLayout() {
  return (
    <div className="relative grid min-h-dvh w-full overflow-hidden bg-background md:grid-cols-2">
      <FloatingOrbs className="pointer-events-none absolute inset-0 hidden md:block" />
      <div className="relative hidden flex-col justify-between border-r border-border bg-gradient-to-b from-muted/30 via-background to-background p-8 md:flex">
        <MetricFlowLogo variant="full" />
        <div className="max-w-sm space-y-4">
          <p className="font-display text-3xl font-semibold leading-tight tracking-tight">{PRODUCT_NAME}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{PRODUCT_TAGLINE}</p>
          <div className="rounded-xl border border-border/80 bg-card/40 p-4 text-xs text-muted-foreground backdrop-blur-sm">
            Subtle motion and glass tokens carry through the marketing site—toggle theme from the app shell after you sign in.
          </div>
        </div>
        <p className="text-xs text-muted-foreground">MetricFlow · portfolio analytics shell</p>
      </div>
      <div className="relative flex flex-col justify-center p-4 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-md"
        >
          <div className="rounded-2xl border border-border bg-glass p-4 shadow-glow md:p-6">
            <Suspense fallback={<FullPageSkeleton />}>
              <Outlet />
            </Suspense>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
