import { cn } from "@/lib/utils";

type LogoVariant = "mark" | "full";

type MetricFlowLogoProps = {
  variant?: LogoVariant;
  className?: string;
};

/** Decorative brand mark + wordmark. Icon paths are aria-hidden; parent links should set aria-label. */
export function MetricFlowLogo({ variant = "full", className }: MetricFlowLogoProps) {
  if (variant === "mark") {
    return (
      <svg
        className={cn("shrink-0", className)}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect width="32" height="32" rx="8" className="fill-primary/15" />
        <path
          d="M8 22V10l4 6 4-6v12"
          className="stroke-primary"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M22 10v12" className="stroke-[hsl(270_85%_65%)]" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <MetricFlowLogo variant="mark" className="h-8 w-8" />
      <span className="font-display text-lg font-semibold tracking-tight">MetricFlow</span>
    </span>
  );
}
