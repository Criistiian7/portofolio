import { BlueyLogo } from "@/components/BlueyLogo";
import { ContactButton } from "@/components/ContactButton";
import { NAV_LINKS } from "@/data/navigation";
import { SITE } from "@/data/site";
import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white shadow-sm shadow-slate-900/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">
        <Link
          to="/"
          aria-label={`${SITE.brand} — pagina principală`}
          className="flex min-w-0 max-w-[58%] items-center gap-2 rounded-lg text-navy no-underline hover:text-brand sm:max-w-none md:max-w-none"
        >
          <BlueyLogo size={44} className="shrink-0 drop-shadow-sm" />
          <span className="min-w-0 font-display text-sm font-bold leading-tight sm:text-base">
            {SITE.brand}
            <span className="block truncate text-xs font-medium text-muted-foreground">
              {SITE.tagline}
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center justify-center gap-8 md:flex"
          aria-label="Navigare principală"
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-brand [&.active]:font-semibold [&.active]:text-brand"
              activeProps={{ className: "active font-semibold text-brand" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-2 shrink-0 md:ml-0 md:flex md:justify-end">
          <ContactButton size="sm" variant="gradient" />
        </div>
      </div>

      <nav
        className="flex gap-2 overflow-x-auto border-t border-slate-200/60 px-4 py-2 md:hidden"
        aria-label="Navigare mobilă"
      >
        {NAV_LINKS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-navy no-underline shadow-sm hover:border-brand hover:text-brand [&.active]:border-brand [&.active]:bg-brand/5 [&.active]:text-brand"
            activeProps={{
              className:
                "active border-brand bg-brand/5 text-brand shadow-sm",
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
