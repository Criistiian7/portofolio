import { StaticImage } from "@/components/StaticImage";
import { FACEBOOK_TOUR_REEL_URL } from "@/data/booking";
import { GALLERY_IMAGES } from "@/data/images";

const embedSrc = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(FACEBOOK_TOUR_REEL_URL)}&show_text=false&width=560&height=420`;

function GalleryVideoEmbed() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy/10">
      <iframe
        src={embedSrc}
        title="Tur video Autorulota Bluey"
        className="absolute inset-0 size-full border-0"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

export function GallerySection() {
  return (
    <section className="bg-navy/5 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-navy">
          Galerie — Bluey în România
        </h2>
        <p className="mt-2 text-muted-foreground">
          Momente reale din călătorii: peisaje, comunități și tur video al
          autorulotei.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <figure className="interactive-lift overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <GalleryVideoEmbed />
            <figcaption className="p-3 text-sm text-muted-foreground">
              Tur video — Autorulota Bluey
            </figcaption>
          </figure>
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
