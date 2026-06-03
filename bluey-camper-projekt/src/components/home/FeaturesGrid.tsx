import { Car, Heart, MapPin, Mountain } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  secondaryIcon?: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: Car,
    title: "Autorulotă echipată",
    description:
      "Bluey este pregătită pentru drumuri lungi: confort, spațiu și tot ce ai nevoie pentru o experiență sigură în România.",
  },
  {
    icon: MapPin,
    secondaryIcon: Mountain,
    title: "Călătorii prin România",
    description:
      "De la poieni la mănăstiri și peisaje montane — descoperim țara împreună, cu rute adaptate grupurilor educative.",
  },
  {
    icon: Heart,
    title: "Misiune socială",
    description:
      "90% din profit finanțează vacanțe gratuite pentru elevii din mediul rural — comunele Pogăceaua și Cristești, jud. Mureș.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h2 className="font-display text-3xl font-bold text-navy">
        Travel & Educate cu Bluey
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        O autorulotă, drumuri prin România și un impact real în comunitățile
        rurale.
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
    </section>
  );
}
