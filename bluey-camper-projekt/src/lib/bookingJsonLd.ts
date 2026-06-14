import { BOOKING, SEASONS } from "@/data/booking";
import { SITE } from "@/data/site";
import { absoluteUrl } from "@/lib/absoluteUrl";

export function buildRezervareOfferJsonLd() {
  const prices = SEASONS.map((s) => s.price);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Închiriere ${SITE.brand}`,
    description:
      "Autorulotă Fiat Ducato 2026, 5 locuri, dotări premium — închiriere în România, jud. Mureș.",
    brand: {
      "@type": "Brand",
      name: SITE.brand,
    },
    category: "Vehicle Rental",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: String(Math.min(...prices)),
      highPrice: String(Math.max(...prices)),
      offerCount: String(SEASONS.length),
      availability: "https://schema.org/InStock",
      url: absoluteUrl("/rezervare"),
      priceSpecification: SEASONS.map((season) => ({
        "@type": "UnitPriceSpecification",
        price: String(season.price),
        priceCurrency: "EUR",
        unitText: BOOKING.priceUnit,
        name: season.name,
      })),
    },
  };
}
