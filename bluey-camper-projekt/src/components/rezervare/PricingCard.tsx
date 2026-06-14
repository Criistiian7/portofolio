import type { Season } from "@/data/booking";
import { formatPrice } from "@/data/booking";

type PricingCardProps = {
  season: Season;
  compact?: boolean;
};

export function PricingCard({ season, compact = false }: PricingCardProps) {
  return (
    <article
      className={`interactive-lift relative rounded-2xl border bg-card p-6 shadow-sm ${
        season.isPeak
          ? "border-brand ring-1 ring-brand/20"
          : "border-border"
      }`}
    >
      {season.isPeak ? (
        <span className="absolute top-4 right-4 rounded-full bg-brand px-2.5 py-0.5 text-xs font-semibold text-brand-foreground">
          Sezon de vârf
        </span>
      ) : null}
      <h3 className="font-display text-lg font-bold text-navy">{season.name}</h3>
      <p
        className={`mt-2 font-display font-bold text-brand ${
          compact ? "text-2xl" : "text-3xl"
        }`}
      >
        {formatPrice(season.price)}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {season.period}
      </p>
    </article>
  );
}
