import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type WidgetShellProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function WidgetShell({ title, description, action, className, children }: WidgetShellProps) {
  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card/60 shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-2 border-b border-border/80 px-4 py-3">
        <div>
          <h2 className="font-display text-sm font-semibold tracking-tight">{title}</h2>
          {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </header>
      <div className="min-h-[12rem] flex-1 p-3">{children}</div>
    </section>
  );
}
