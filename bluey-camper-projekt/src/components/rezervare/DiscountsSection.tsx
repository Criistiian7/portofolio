import { DISCOUNTS } from "@/data/booking";
import { Gift } from "lucide-react";

export function DiscountsSection() {
  return (
    <section
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16"
      aria-labelledby="reduceri-heading"
    >
      <h2
        id="reduceri-heading"
        className="font-display text-3xl font-bold text-navy"
      >
        Reduceri
      </h2>
      <p className="mt-2 text-muted-foreground">
        Sejururi mai lungi — mai mult timp pe drum, mai mult impact social.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {DISCOUNTS.map((discount) => (
          <li
            key={discount.nights}
            className="interactive-lift flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-forest">
              <Gift className="size-6" aria-hidden />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-navy">
                {discount.label}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                La rezervări de minimum {discount.nights} nopți consecutive.
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
