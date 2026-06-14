import {
  AMENITY_GROUP_META,
  type AmenityGroupId,
} from "@/components/amenities/amenityMeta";
import type { AmenityGroup } from "@/data/booking";
import { ChevronDown } from "lucide-react";

type AmenityGroupCardProps = {
  group: AmenityGroup;
  defaultOpen?: boolean;
  /** Compact accordion on small screens */
  collapsibleOnMobile?: boolean;
};

export function AmenityGroupCard({
  group,
  defaultOpen = false,
  collapsibleOnMobile = true,
}: AmenityGroupCardProps) {
  const meta = AMENITY_GROUP_META[group.id as AmenityGroupId];
  const Icon = meta.icon;

  const cardBody = (
    <>
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${meta.glowClass}`}
        aria-hidden
      />
      <div className="relative flex items-start gap-4">
        <div
          className={`flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1 ring-black/5 ${meta.accentClass}`}
        >
          <Icon className="size-6" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="font-display text-lg font-bold tracking-tight text-navy">
            {group.title}
          </h3>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {group.items.length} dotări incluse
          </p>
        </div>
      </div>
      <ul className="relative mt-5 flex flex-wrap gap-2">
        {group.items.map((item) => (
          <li key={item}>
            <span
              className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium leading-snug ${meta.chipClass}`}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </>
  );

  if (collapsibleOnMobile) {
    return (
      <>
        <details
          className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm sm:hidden"
          open={defaultOpen}
        >
          <summary className="relative flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
            <div
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${meta.accentClass}`}
            >
              <Icon className="size-5" aria-hidden />
            </div>
            <span className="min-w-0 flex-1 font-display font-bold text-navy">
              {group.title}
            </span>
            <ChevronDown
              className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="relative border-t border-border/60 px-5 pb-5">
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item}>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${meta.chipClass}`}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </details>

        <article className="relative hidden overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-shadow hover:shadow-md sm:block">
          {cardBody}
        </article>
      </>
    );
  }

  return (
    <article className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      {cardBody}
    </article>
  );
}
