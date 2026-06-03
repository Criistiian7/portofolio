import { StaticImage } from "@/components/StaticImage";
import { GALLERY_IMAGES } from "@/data/images";

export function GallerySection() {
  return (
    <section className="bg-navy/5 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-navy">
          Galerie — Bluey în România
        </h2>
        <p className="mt-2 text-muted-foreground">
          Momente reale din călătoriile noastre: peisaje, comunități și
          experiențe educative.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_IMAGES.map((image) => (
            <figure
              key={image.src}
              className="interactive-lift overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <StaticImage
                image={image}
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
