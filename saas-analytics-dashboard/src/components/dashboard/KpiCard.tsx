import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type KpiCardProps = {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  className?: string;
};

export function KpiCard({ label, value, hint, className }: KpiCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-gradient-to-br from-card/90 to-card/40 p-4 shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold tabular-nums tracking-tight">{value}</p>
      {hint ? <div className="mt-2 text-xs text-muted-foreground">{hint}</div> : null}
    </div>
  );
}
