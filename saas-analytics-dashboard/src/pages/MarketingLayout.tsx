import { FormEvent, useState } from "react";
import { Link, NavLink, Navigate, Outlet } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { paths } from "@/lib/paths";
import { PRODUCT_NAME, SOCIAL_GITHUB, SUPPORT_EMAIL } from "@/brand/constants";
import { MetricFlowLogo } from "@/brand/MetricFlowLogo";
import { DocumentTitle } from "@/components/system/DocumentTitle";
import { FullPageSkeleton } from "@/components/system/FullPageSkeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MarketingLayout() {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");

  const onNewsletter = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Add an email to subscribe.");
      return;
    }
    toast.success("Thanks—this client-only demo would POST to your API next.");
    setEmail("");
  };

  if (loading) return <FullPageSkeleton />;
  if (user) return <Navigate to={paths.overview} replace />;

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <DocumentTitle title={`${PRODUCT_NAME} — Revenue workspace`} />
      <a
        href="#marketing-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/75 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
          <Link to={paths.root} className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`${PRODUCT_NAME} home`}>
            <MetricFlowLogo variant="full" />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex" aria-label="Marketing">
            <NavLink
              to={paths.root}
              end
              className={({ isActive }) =>
                cn("text-muted-foreground transition-colors hover:text-foreground", isActive && "text-foreground")
              }
            >
              Product
            </NavLink>
            <NavLink
              to={paths.pricing}
              className={({ isActive }) =>
                cn("text-muted-foreground transition-colors hover:text-foreground", isActive && "text-foreground")
              }
            >
              Pricing
            </NavLink>
            <a href={`${paths.root}#faq`} className="text-muted-foreground transition-colors hover:text-foreground">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to={paths.login}>Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to={paths.register}>Get started</Link>
            </Button>
          </div>
        </div>
      </header>
      <main id="marketing-main" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="border-t border-border bg-muted/15 py-12">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2">
          <div>
            <MetricFlowLogo variant="full" className="mb-3" />
            <p className="max-w-sm text-sm text-muted-foreground">
              MetricFlow is a portfolio-grade analytics shell—Firebase optional, motion-aware, and ready for your case study.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Questions?{" "}
              <a className="underline underline-offset-4 hover:text-foreground" href={`mailto:${SUPPORT_EMAIL}`}>
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Client-only newsletter</p>
            <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={onNewsletter}>
              <label htmlFor="newsletter-email" className="sr-only">
                Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" variant="secondary">
                Subscribe
              </Button>
            </form>
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <a className="underline underline-offset-4 hover:text-foreground" href="#" aria-label="Privacy (placeholder)">
                Privacy
              </a>
              <a className="underline underline-offset-4 hover:text-foreground" href="#" aria-label="Terms (placeholder)">
                Terms
              </a>
              <a className="underline underline-offset-4 hover:text-foreground" href={SOCIAL_GITHUB} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
