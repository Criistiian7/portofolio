import { ContactButton } from "@/components/ContactButton";
import { StaticImage } from "@/components/StaticImage";
import { BOOKING } from "@/data/booking";
import { IMAGES } from "@/data/images";

export function RezervareHero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-16">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">
          {BOOKING.startingPriceLabel}
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
          Rezervare Autorulota Bluey — tarife și condiții
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Fiat Ducato 2026 · 5 locuri · dotări premium incluse. Contactează-ne
          pentru confirmarea disponibilității — fără sistem de plată online.
        </p>
        <div className="mt-8">
          <ContactButton size="lg" intent="booking" />
        </div>
      </div>
      <div>
        <StaticImage
          image={IMAGES.rezervareHero}
          className="interactive-lift aspect-[4/3] w-full rounded-2xl object-cover shadow-lg"
        />
      </div>
    </section>
  );
}
