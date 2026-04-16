import type { ReactNode } from "react";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 transition-colors dark:bg-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[min(100%,96rem)] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </div>
    </main>
  );
}

export function DashboardLayout({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] 2xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      {sidebar}
      <div className="flex min-w-0 flex-col gap-8">{children}</div>
    </div>
  );
}
