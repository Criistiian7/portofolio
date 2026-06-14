export const BOOKING = {
  startingPrice: 90,
  currency: "€",
  priceUnit: "noapte",
  startingPriceLabel: "De la 90 €/noapte",
} as const;

export const HERO_HIGHLIGHTS = [
  "De la 90 €/noapte",
  "5 locuri",
  "5 paturi",
  "Model 2026",
  "Fiat Ducato",
  "Aer condiționat",
  "Panouri solare",
] as const;

export type Season = {
  id: string;
  name: string;
  price: number;
  period: string;
  months: readonly string[];
  isPeak?: boolean;
};

export const SEASONS: readonly Season[] = [
  {
    id: "extrasezon",
    name: "Extrasezon",
    price: 90,
    period: "Ianuarie, Februarie, Noiembrie",
    months: ["Ianuarie", "Februarie", "Noiembrie"],
  },
  {
    id: "intermediar",
    name: "Sezon intermediar",
    price: 110,
    period: "1 Martie – 14 Iunie · Octombrie · Decembrie (exceptând sărbătorile)",
    months: ["Martie – 14 Iunie", "Octombrie", "Decembrie"],
  },
  {
    id: "varf",
    name: "Sezon de vârf",
    price: 140,
    period: "15 Iunie – 15 Septembrie",
    months: ["15 Iunie – 15 Septembrie"],
    isPeak: true,
  },
] as const;

export type Discount = {
  nights: number;
  freeNights: number;
  label: string;
};

export const DISCOUNTS: readonly Discount[] = [
  { nights: 10, freeNights: 1, label: "10 nopți → 1 noapte gratuită" },
  { nights: 20, freeNights: 2, label: "20 nopți → 2 nopți gratuite" },
] as const;

export type Bed = {
  id: string;
  name: string;
  dimensions: string;
  capacity: string;
  capacityCount: number;
};

export const BEDS: readonly Bed[] = [
  {
    id: "dormitor",
    name: "Dormitor principal",
    dimensions: "140 × 190 cm",
    capacity: "2 persoane",
    capacityCount: 2,
  },
  {
    id: "alcova",
    name: "Pat alcovă",
    dimensions: "146 × 220 cm",
    capacity: "2 persoane",
    capacityCount: 2,
  },
  {
    id: "living",
    name: "Pat living",
    dimensions: "107 × 220 cm",
    capacity: "1 persoană",
    capacityCount: 1,
  },
] as const;

export type AmenityGroup = {
  id: string;
  title: string;
  items: readonly string[];
};

export const AMENITY_GROUPS: readonly AmenityGroup[] = [
  {
    id: "premium",
    title: "Pachet confort PREMIUM",
    items: [
      "Aer condiționat cabină șofer",
      "Cruise Control",
      "MediaNav+",
      "Cameră marșarier",
      "Marchiză exterioară 4 m",
      "Suport pentru 3 biciclete",
      "Încălzire și apă caldă TRUMA pe gaz",
    ],
  },
  {
    id: "fotovoltaic",
    title: "Pachet fotovoltaic",
    items: ["Baterie auxiliară 200 Ah+", "Panouri solare", "Invertor"],
  },
  {
    id: "camping",
    title: "Set camping terasă",
    items: ["Masă", "5 scaune"],
  },
  {
    id: "alte",
    title: "Alte dotări",
    items: [
      "Plase de insecte și jaluzele de noapte la toate geamurile",
      "Rezervor apă uzată 100 l",
      "Casetă WC 17 l",
      "Lenjerii de pat incluse",
      "Veselă completă pentru bucătărie",
      "Board games și cărți",
      "Portbagaj spațios pentru depozitare",
    ],
  },
] as const;

/** Top amenities shown on Home preview */
export const AMENITIES_PREVIEW = [
  "Aer condiționat cabină șofer",
  "Panouri solare + baterie 200 Ah+",
  "Încălzire TRUMA pe gaz",
  "Marchiză exterioară 4 m",
  "Suport 3 biciclete",
  "Lenjerii și veselă incluse",
  "Cameră marșarier",
  "5 locuri · Fiat Ducato 2026",
] as const;

export const FEES = [
  { label: "Garanție returnabilă", value: "500 €" },
  { label: "Taxă consumabile și igienizare", value: "50 €/sejur" },
] as const;

export const BOOKING_CONDITIONS = [
  "Avans 50% la rezervare",
  "Restul de 50% cu minimum 3 zile înainte de plecare",
  "Minim 5 zile în sezon",
  "Minim 3 zile în afara sezonului",
  "Garanția se restituie în maximum 3 zile dacă nu există daune",
] as const;

export const WHATSAPP_BOOKING_MESSAGE =
  "Bună! Aș dori să rezerv Autorulota Bluey pentru perioada [data plecare] – [data întoarcere]. Sunt [număr] persoane. Mulțumesc!";

export const FACEBOOK_TOUR_REEL_URL =
  "https://www.facebook.com/reel/1527226392258215";

export function formatPrice(price: number): string {
  return `${price} ${BOOKING.currency}/${BOOKING.priceUnit}`;
}
