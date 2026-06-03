import { SocialBrandButton } from "@/components/SocialBrandButton";
import { SOCIAL_LINKS } from "@/data/site";

export function SocialSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="interactive-lift rounded-2xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
        <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">
          Urmărește-ne pe rețelele sociale
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Vezi poze din drum, povești din tabere și noutăți despre proiectul
          Travel & Educate.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {SOCIAL_LINKS.map((link) => (
            <SocialBrandButton
              key={link.network}
              network={link.network}
              href={link.href}
              label={link.label}
              variant="pill"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
