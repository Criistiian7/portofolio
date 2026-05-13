import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { FullPageSkeleton } from "@/components/system/FullPageSkeleton";

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-muted/30 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.12),transparent_55%)]" />
      <div className="relative w-full max-w-md">
        <Suspense fallback={<FullPageSkeleton />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
