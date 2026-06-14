import { Car, Heart, MapPin, Mountain } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

type Feature = {
  icon: LucideIcon;
  secondaryIcon?: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: Car,
    title: "Închiriere all-inclusive",
    description:
      "Fiat Ducato 2026, 5 locuri — dotări premium, panouri solare și lenjerii incluse. De la 90 €/noapte, fără costuri ascunse la dotări.",
  },
  {
    icon: MapPin,
    secondaryIcon: Mountain,
    title: "România la volanul tău",
    description:
      "De la poieni la mănăstiri și peisaje montane — autorulota e pregătită pentru drumuri lungi, cu confort pentru familii și grupuri mici.",
  },
  {
    icon: Heart,
    title: "Călătorie cu impact",
    description:
      "90% din profit finanțează vacanțe gratuite pentru elevii din Pogăceaua și Cristești, jud. Mureș — Travel & Educate cu sens.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h2 className="font-display text-3xl font-bold text-navy">
        Travel & Educate cu Bluey
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Închiriază autorulota pentru vacanța ta și susține simultan misiunea
        socială din comunitățile rurale.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          const Secondary = feature.secondaryIcon;

          return (
            <article
              key={feature.title}
              className="interactive-lift rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="relative flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Icon className="size-6" aria-hidden />
                {Secondary ? (
                  <Secondary
                    className="absolute -bottom-0.5 -right-0.5 size-4 text-brand/70"
                    aria-hidden
                  />
                ) : null}
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-navy">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </article>
          );
        })}
      </div>
      <p className="mt-8 text-center">
        <Link
          to="/rezervare"
          className="text-sm font-semibold text-brand hover:text-brand-deep"
        >
          Detalii rezervare și tarife →
        </Link>
      </p>
    </section>
  );
}
