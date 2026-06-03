import { StaticImage } from "@/components/StaticImage";
import { IMAGES } from "@/data/images";
import { SITE } from "@/data/site";

export function MisiuneHero() {
  return (
    <section className="hero-gradient mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-16">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">
          {SITE.tagline}
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-ink sm:text-5xl">
          Misiunea noastră socială
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {SITE.mission.summary}
        </p>
      </div>
      <StaticImage
        image={IMAGES.pajisteHero}
        priority
        className="interactive-lift aspect-[4/3] w-full rounded-3xl object-cover shadow-lg"
      />
    </section>
  );
}
