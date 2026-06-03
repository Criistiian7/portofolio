import { StaticImage } from "@/components/StaticImage";
import { IMAGES } from "@/data/images";
import { SITE } from "@/data/site";

export function TravelEducateBlock() {
  return (
    <section className="border-y border-border bg-card py-12 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <StaticImage
          image={IMAGES.copertina}
          width={640}
          height={480}
          className="interactive-lift order-2 aspect-[4/3] w-full rounded-3xl object-cover shadow-md lg:order-1"
        />
        <div className="order-1 lg:order-2">
          <h2 className="font-display text-3xl font-bold text-ink">
            Travel & Educate
          </h2>
          <p className="mt-4 text-muted-foreground">
            {SITE.mission.travelEducate}
          </p>
          <p className="mt-4 text-muted-foreground">
            Nu vindem doar o călătorie — construim punți între școală, natură
            și comunitate. Fiecare sezon pe drum înseamnă resurse pentru
            programele noastre sociale.
          </p>
        </div>
      </div>
    </section>
  );
}
