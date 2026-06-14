import { ContactButton } from "@/components/ContactButton";
import { BOOKING } from "@/data/booking";
import { SITE } from "@/data/site";

export function RezervareCtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="interactive-lift rounded-3xl bg-accent px-6 py-10 text-center text-accent-foreground shadow-lg sm:px-12">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Contactează-ne pentru rezervare
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-accent-foreground/90">
          {BOOKING.startingPriceLabel} · {SITE.phoneDisplay}. Trimite perioada
          dorită pe WhatsApp — îți răspundem cu confirmarea și pașii următori.
        </p>
        <div className="mt-8 flex justify-center">
          <ContactButton size="lg" variant="light" intent="booking" />
        </div>
      </div>
    </section>
  );
}
