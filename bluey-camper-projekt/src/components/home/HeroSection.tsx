import { ContactButton } from "@/components/ContactButton";
import { StaticImage } from "@/components/StaticImage";
import { BOOKING } from "@/data/booking";
import { IMAGES } from "@/data/images";
import { SITE } from "@/data/site";
import { Link } from "@tanstack/react-router";
import { HeartHandshake, Tag } from "lucide-react";

export function HeroSection() {
  return (
    <section
      className="hero-section relative w-full min-h-[850px] overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <StaticImage
        image={IMAGES.heroCover}
        priority
        className="absolute inset-0 z-0 h-full w-full object-cover object-[72%_68%] sm:object-[76%_62%] lg:object-[82%_55%]"
      />

      <div className="hero-cover-fade pointer-events-none absolute inset-0 z-[1]" />
      <div className="hero-section-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-[620px] py-16 sm:py-20 lg:py-[120px]">
          <div className="hero-badges flex max-[479px]:flex-col max-[479px]:items-start sm:flex-row sm:items-center sm:gap-5">
            <span className="hero-badge hero-badge--price inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold sm:text-sm">
              <Tag className="size-3.5 shrink-0" aria-hidden />
              {BOOKING.startingPriceLabel}
            </span>
            <span className="hero-badge hero-badge--mission inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold leading-snug sm:text-sm">
              <HeartHandshake className="size-3.5 shrink-0" aria-hidden />
              {SITE.profitShare} pentru misiunea socială
            </span>
          </div>

          <h1
            id="hero-heading"
            className="hero-headline-serif mt-7 text-[1.3125rem] font-bold leading-[1.2] tracking-[-0.02em] text-ink sm:mt-8 sm:text-[1.5rem] md:text-[1.625rem] lg:text-[1.75rem] xl:text-[1.875rem]"
          >
            <span className="block">Închiriază autorulota Bluey —</span>
            <span className="mt-1 block leading-[1.15]">
              <span className="hero-headline-script hero-headline-script--emphasis">
                călătorește 
              </span>{" "}
              <span> și <span className="hero-headline-script hero-headline-script--emphasis"> educă </span></span>
            </span>
          </h1>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Fiat Ducato 2026, 5 locuri — și {SITE.profitShare} finanțează vacanțe
            educative pentru elevii din mediul rural.
          </p>

          <div className="hero-cta-row mt-10 flex flex-col items-stretch gap-4 max-sm:gap-3 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-start sm:gap-6">
            <ContactButton
              size="lg"
              variant="gradient"
              intent="booking"
              className="shrink-0 justify-center max-sm:w-full"
            />
            <Link
              to="/rezervare"
              className="hero-secondary-cta interactive-lift inline-flex shrink-0 items-center justify-center whitespace-nowrap max-sm:w-full"
            >
              Vezi tarife complete
            </Link>
            <Link
              to="/misiunea-sociala"
              className="hero-mission-link inline-flex shrink-0 items-center justify-center whitespace-nowrap max-sm:w-full"
            >
              Vezi misiunea →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
