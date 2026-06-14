import { ContactButton } from "@/components/ContactButton";
import { BOOKING } from "@/data/booking";
import { SITE } from "@/data/site";
import { Link } from "@tanstack/react-router";

export function BookingCtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="interactive-lift rounded-3xl bg-accent px-6 py-10 text-center text-accent-foreground shadow-lg sm:px-12">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Gata de drum? Rezervă Autorulota Bluey
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-accent-foreground/90">
          {BOOKING.startingPriceLabel} · {SITE.phoneDisplay}. Sună sau scrie-ne
          pe WhatsApp — confirmăm disponibilitatea și detaliile sejurului.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ContactButton size="lg" variant="light" intent="booking" />
          <Link
            to="/rezervare"
            className="text-sm font-semibold text-accent-foreground underline-offset-4 hover:underline"
          >
            Vezi toate condițiile de rezervare
          </Link>
        </div>
      </div>
    </section>
  );
}
