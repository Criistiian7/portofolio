import {
  AMENITY_GROUP_META,
  AMENITY_PREVIEW_ITEMS,
} from "@/components/amenities/amenityMeta";
import { Link } from "@tanstack/react-router";

export function AmenitiesPreviewSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-navy">
            Dotări incluse
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Pachet premium, fotovoltaic și tot ce ai nevoie — fără surprize la
            check-in.
          </p>
        </div>
        <Link
          to="/rezervare"
          hash="dotari"
          className="shrink-0 text-sm font-semibold text-brand hover:text-brand-deep"
        >
          Lista completă →
        </Link>
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {AMENITY_PREVIEW_ITEMS.map((item) => {
          const Icon = item.icon;
          const meta = AMENITY_GROUP_META[item.groupId];

          return (
            <li key={item.label}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-md">
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 ${meta.glowClass}`}
                  aria-hidden
                />
                <div className="relative flex items-start gap-3">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-black/5 ${meta.accentClass}`}
                  >
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <p className="pt-1.5 text-sm font-medium leading-snug text-navy">
                    {item.label}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
