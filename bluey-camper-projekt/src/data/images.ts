import type { SiteImage } from "@/types/image";

const HERO_ALT =
  "Autorulota Bluey pe o poiană din România, cu peisaj montan în fundal";
const PAJISTE_ALT = "Autorulota Bluey pe o pajișe verde din România";

/** 6 fotografii — fiecare folosită cel puțin o dată în site */
export const IMAGES = {
  hero: {
    src: "/images/bluey-poiana.jpg",
    alt: HERO_ALT,
    width: 800,
    height: 600,
  },
  pajisteHero: {
    src: "/images/bluey-pajiste.jpg",
    alt: PAJISTE_ALT,
    width: 800,
    height: 600,
  },
  manastire: {
    src: "/images/bluey-manastire.jpg",
    alt: "Autorulota Bluey lângă o mănăstire din România",
  },
  copertina: {
    src: "/images/bluey-copertina.jpg",
    alt: "Autorulota Bluey cu copertina deschisă, pregătită pentru o pauză",
  },
  brandTelefon: {
    src: "/images/bluey-brand-telefon.jpg",
    alt: "Autorulota Bluey cu branding și număr de telefon vizibil",
  },
  peisaj: {
    src: "/images/bluey-peisaj.jpg",
    alt: "Autorulota Bluey într-un peisaj pitoresc din România",
  },
} as const satisfies Record<string, SiteImage>;

export const GALLERY_IMAGES: readonly SiteImage[] = [
  IMAGES.manastire,
  IMAGES.pajisteHero,
  IMAGES.copertina,
  IMAGES.brandTelefon,
  IMAGES.peisaj,
];
