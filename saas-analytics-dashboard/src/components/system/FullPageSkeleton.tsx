import { Skeleton } from "@/components/ui/skeleton";

export function FullPageSkeleton() {
  return (
    <div className="flex min-h-dvh flex-col gap-4 p-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-72" />
    </div>
  );
}
