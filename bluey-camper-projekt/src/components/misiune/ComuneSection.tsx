import { StaticImage } from "@/components/StaticImage";
import { IMAGES } from "@/data/images";
import { SITE } from "@/data/site";

const comuneImages = [IMAGES.peisaj, IMAGES.manastire, IMAGES.brandTelefon] as const;

export function ComuneSection() {
  return (
    <section className="bg-forest/5 py-12 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-start">
        <div>
          <h2 className="font-display text-3xl font-bold text-ink">
            Pogăceaua & Cristești
          </h2>
          <p className="mt-4 text-muted-foreground">{SITE.mission.comune}</p>
          <p className="mt-4 text-muted-foreground">
            Jud. Mureș — aici investim {SITE.profitShare} din profitul
            călătoriilor comerciale, astfel încât elevii să aibă șansa la
            experiențe care îi țin aproape de școală.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {comuneImages.map((image, index) => (
            <figure
              key={image.src}
              className={`interactive-lift overflow-hidden rounded-2xl border border-border shadow-sm ${index === 0 ? "sm:col-span-2" : ""}`}
            >
              <StaticImage
                image={image}
                className="aspect-[4/3] w-full object-cover"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
