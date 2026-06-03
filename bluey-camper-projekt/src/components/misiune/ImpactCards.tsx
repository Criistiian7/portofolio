import { BookOpen, CheckCircle2, GraduationCap, Users } from "lucide-react";
import type { ReactNode } from "react";

type ImpactCard = {
  iconSlot: ReactNode;
  title: string;
  description: string;
};

const cards: ImpactCard[] = [
  {
    iconSlot: <BookOpen className="size-6" aria-hidden />,
    title: "Excursii educative",
    description:
      "Ieșiri organizate cu conținut pedagogic: istorie locală, natură, meșteșuguri și întâlniri cu comunități din România.",
  },
  {
    iconSlot: <Users className="size-6" aria-hidden />,
    title: "Tabere gratuite",
    description:
      "Vacanțe finanțate din profitul proiectului pentru elevii din mediul rural care altfel nu ar avea acces la astfel de experiențe.",
  },
  {
    iconSlot: (
      <>
        <GraduationCap className="size-5" aria-hidden />
        <CheckCircle2 className="size-5 opacity-80" aria-hidden />
      </>
    ),
    title: "Motivație pentru școală",
    description:
      "Prin povești, modele pozitive și timp petrecut împreună, încurajăm prezența la școală și reducerea abandonului școlar.",
  },
];

export function ImpactCards() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h2 className="text-center font-display text-3xl font-bold text-ink">
        Ce oferim comunității
      </h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="interactive-lift rounded-3xl border border-border bg-card p-8 shadow-sm"
          >
            <div className="flex size-12 items-center justify-center gap-1 rounded-xl bg-accent/10 text-accent">
              {card.iconSlot}
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-ink">
              {card.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {card.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
