import { ContactButton } from "@/components/ContactButton";
import { StaticImage } from "@/components/StaticImage";
import { IMAGES } from "@/data/images";
import { SITE } from "@/data/site";
import { Link } from "@tanstack/react-router";

export function HeroSection() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-16">
      <div>
        <span className="inline-flex rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
          {SITE.profitShare} pentru misiunea socială
        </span>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
          Descoperă România cu Bluey
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Călătorii educative cu autorulota noastră — Travel & Educate pentru
          elevi din mediul rural și pentru familii care vor să exploreze țara.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <ContactButton size="lg" />
          <Link
            to="/misiunea-sociala"
            className="text-sm font-semibold text-brand hover:text-brand-deep"
          >
            Vezi misiunea noastră →
          </Link>
        </div>
      </div>
      <div>
        <StaticImage
          image={IMAGES.hero}
          priority
          className="interactive-lift aspect-[4/3] w-full rounded-2xl object-cover shadow-lg"
        />
      </div>
    </section>
  );
}
