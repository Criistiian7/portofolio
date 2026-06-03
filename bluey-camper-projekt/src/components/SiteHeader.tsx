import { BlueyLogo } from "@/components/BlueyLogo";
import { ContactButton } from "@/components/ContactButton";
import { NAV_LINKS } from "@/data/navigation";
import { SITE } from "@/data/site";
import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          aria-label={`${SITE.brand} — pagina principală`}
          className="flex items-center gap-2 rounded-lg text-navy no-underline hover:text-brand"
        >
          <BlueyLogo size={44} className="drop-shadow-sm" />
          <span className="font-display text-sm font-bold leading-tight sm:text-base">
            {SITE.brand}
            <span className="block text-xs font-medium text-muted">
              {SITE.tagline}
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Navigare principală"
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted-foreground hover:text-brand [&.active]:text-brand"
              activeProps={{ className: "active text-brand" }}
            >
              {item.label}
            </Link>
          ))}
          <ContactButton size="sm" />
        </nav>

        <div className="md:hidden">
          <ContactButton size="sm" />
        </div>
      </div>

      <nav
        className="flex gap-2 overflow-x-auto border-t border-border/60 px-4 py-2 md:hidden"
        aria-label="Navigare mobilă"
      >
        {NAV_LINKS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="shrink-0 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-navy no-underline hover:border-brand hover:text-brand [&.active]:border-brand [&.active]:bg-brand/5 [&.active]:text-brand"
            activeProps={{ className: "active border-brand bg-brand/5 text-brand" }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
