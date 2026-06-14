import { ContactButton } from "@/components/ContactButton";
import { StaticImage } from "@/components/StaticImage";
import { BOOKING } from "@/data/booking";
import { IMAGES } from "@/data/images";
import { SITE } from "@/data/site";
import { Link } from "@tanstack/react-router";

export function HeroSection() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-16">
      <div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
            {BOOKING.startingPriceLabel}
          </span>
          <span className="inline-flex rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
            {SITE.profitShare} pentru misiunea socială
          </span>
        </div>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
          Închiriază autorulota Bluey — călătorește responsabil în România
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Fiat Ducato 2026, 5 locuri — și {SITE.profitShare} finanțează vacanțe
          educative pentru elevii din mediul rural.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <ContactButton size="lg" intent="booking" />
          <Link
            to="/rezervare"
            className="interactive-lift inline-flex items-center rounded-full border border-brand px-5 py-3 text-sm font-semibold text-brand hover:bg-brand/5"
          >
            Vezi tarife complete
          </Link>
          <Link
            to="/misiunea-sociala"
            className="text-sm font-semibold text-brand hover:text-brand-deep"
          >
            Vezi misiunea →
          </Link>
        </div>
      </div>
      <div>
        <StaticImage
          image={IMAGES.hero}
          priority
          className="interactive-lift aspect-[4/3] w-full rounded-2xl object-cover shadow-lg"
        />
      </div>
    </section>
  );
}
