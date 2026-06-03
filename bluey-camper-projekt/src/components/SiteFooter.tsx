import { BlueyLogo } from "@/components/BlueyLogo";
import { SocialBrandButton } from "@/components/SocialBrandButton";
import { SITE, SOCIAL_LINKS } from "@/data/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex min-h-40 items-stretch gap-4">
          <BlueyLogo
            stretch
            className="h-full max-h-40 w-auto shrink-0 object-contain object-left drop-shadow-sm"
          />
          <div className="flex flex-col justify-center">
            <p className="font-display font-bold text-navy">{SITE.brand}</p>
            <p className="text-sm text-muted">{SITE.tagline}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Telefon:{" "}
              <a
                href={SITE.phoneTel}
                className="font-medium text-brand hover:text-brand-deep"
              >
                {SITE.phoneDisplay}
              </a>
            </p>
          </div>
        </div>

        <nav aria-label="Rețele sociale">
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((link) => (
              <SocialBrandButton
                key={link.network}
                network={link.network}
                href={link.href}
                label={link.label}
              />
            ))}
          </div>
        </nav>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © {year} {SITE.brand}. Toate drepturile rezervate.
      </div>
    </footer>
  );
}
