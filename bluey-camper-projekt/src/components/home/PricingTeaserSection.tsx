import { PricingCard } from "@/components/rezervare/PricingCard";
import { SEASONS } from "@/data/booking";
import { Link } from "@tanstack/react-router";

export function PricingTeaserSection() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-navy">
          Tarife de la 90 €/noapte
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Prețuri pe sezon — garanție returnabilă și dotări premium incluse.
          Contactează-ne pentru confirmarea disponibilității.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SEASONS.map((season) => (
            <PricingCard key={season.id} season={season} compact />
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link
            to="/rezervare"
            hash="tarife"
            className="text-sm font-semibold text-brand hover:text-brand-deep"
          >
            Vezi tarife complete, reduceri și condiții →
          </Link>
        </p>
      </div>
    </section>
  );
}
