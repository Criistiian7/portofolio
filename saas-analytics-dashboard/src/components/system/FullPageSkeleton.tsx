import { Skeleton } from "@/components/ui/skeleton";
import { MetricFlowLogo } from "@/brand/MetricFlowLogo";

export function FullPageSkeleton() {
  return (
    <div className="flex min-h-dvh flex-col gap-4 bg-background p-6">
      <div className="flex items-center gap-3">
        <MetricFlowLogo variant="mark" className="h-9 w-9 opacity-80" />
        <Skeleton className="h-8 w-40" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-72" />
    </div>
  );
}
