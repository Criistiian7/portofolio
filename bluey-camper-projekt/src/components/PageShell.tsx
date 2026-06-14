import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { MobileBookingBar } from "@/components/MobileBookingBar";
import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  showMobileBookingBar?: boolean;
};

export function PageShell({
  children,
  showMobileBookingBar = false,
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className={showMobileBookingBar ? "pb-20 md:pb-0" : undefined}
      >
        {children}
      </main>
      <SiteFooter />
      {showMobileBookingBar ? <MobileBookingBar /> : null}
    </div>
  );
}
