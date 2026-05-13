import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ChartCard({
  title,
  description,
  isLoading,
  isEmpty,
  emptyText = "No data in this range",
  children,
}: {
  title: string;
  description?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyText?: string;
  children: ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="h-[280px]">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : isEmpty ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">{emptyText}</div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
