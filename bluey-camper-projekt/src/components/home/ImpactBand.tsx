import { StaticImage } from "@/components/StaticImage";
import { IMAGES } from "@/data/images";
import { SITE } from "@/data/site";
import { Heart } from "lucide-react";

export function ImpactBand() {
  return (
    <section className="bg-brand/5 py-12 sm:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-2 text-brand">
            <Heart className="size-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Impact social
            </span>
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold text-navy sm:text-3xl">
            Fiecare călătorie susține elevii din mediul rural
          </h2>
          <p className="mt-4 text-muted-foreground">{SITE.mission.summary}</p>
        </div>
        <StaticImage
          image={IMAGES.manastire}
          width={640}
          height={480}
          className="interactive-lift aspect-[4/3] w-full rounded-2xl object-cover shadow-md"
        />
      </div>
    </section>
  );
}
