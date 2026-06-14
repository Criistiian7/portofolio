import { PricingCard } from "@/components/rezervare/PricingCard";
import { SEASONS } from "@/data/booking";

export function PricingSection() {
  return (
    <section
      id="tarife"
      className="scroll-mt-24 bg-brand/5 py-12 sm:py-16"
      aria-labelledby="tarife-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id="tarife-heading"
          className="font-display text-3xl font-bold text-navy"
        >
          Tarife
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Prețuri pe noapte, în funcție de sezon. Toate tarifele includ dotările
          standard ale autorulotei.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SEASONS.map((season) => (
            <PricingCard key={season.id} season={season} />
          ))}
        </div>
      </div>
    </section>
  );
}
