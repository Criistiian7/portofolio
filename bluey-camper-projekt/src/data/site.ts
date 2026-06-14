import { WHATSAPP_BOOKING_MESSAGE } from "@/data/booking";

export const BRAND_LOGO = {
  src: "/images/bluey-logo.png",
  alt: "Bluey Autorulota — logo",
} as const;

export const SITE = {
  brand: "Autorulota Bluey",
  tagline: "Travel and Educate",
  phoneDisplay: "+40 742 652 698",
  phoneTel: "tel:+40742652698",
  whatsappMessage:
    "Bună! Aș dori să aflu mai multe despre Autorulota Bluey și călătoriile educative.",
  profitShare: "90% din profit",
  mission: {
    summary:
      "90% din profit finanțează vacanțe gratuite pentru elevii din mediul rural — comunele Pogăceaua și Cristești, jud. Mureș. Luptăm împotriva abandonului școlar.",
    travelEducate:
      "Autorulota Bluey este un proiect Travel & Educate: călătorim prin România cu o autorulotă echipată și transformăm fiecare drum într-o lecție deschisă — natură, cultură și comunitate.",
    comune:
      "Sprijinim direct elevii din comunele Pogăceaua și Cristești (jud. Mureș), unde accesul la experiențe educative în afara școlii este limitat.",
  },
  social: {
    facebook: {
      label: "Facebook",
      href: "https://www.facebook.com/share/1Dz29jmRCa/?mibextid=wwXIfr",
    },
    instagram: {
      label: "Instagram",
      href: "https://www.instagram.com/autorulotabluey",
      handle: "@autorulotabluey",
    },
  },
} as const;

export const SOCIAL_LINKS = [
  {
    network: "facebook" as const,
    label: SITE.social.facebook.label,
    href: SITE.social.facebook.href,
  },
  {
    network: "instagram" as const,
    label: SITE.social.instagram.label,
    href: SITE.social.instagram.href,
  },
] as const;

export const SOCIAL_BRAND = {
  facebook: "#1877F2",
  instagram: {
    from: "#f58529",
    via: "#dd2a7b",
    to: "#8134af",
  },
} as const;

export type ContactIntent = "mission" | "booking";

const WHATSAPP_PHONE = "40742652698";

const WHATSAPP_MESSAGES: Record<ContactIntent, string> = {
  mission: SITE.whatsappMessage,
  booking: WHATSAPP_BOOKING_MESSAGE,
};

export function buildWhatsappUrl(intent: ContactIntent = "mission"): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGES[intent])}`;
}

export const CONTACT = {
  tel: SITE.phoneTel,
  whatsappUrl: buildWhatsappUrl("mission"),
  whatsappBookingUrl: buildWhatsappUrl("booking"),
} as const;

export const SEO = {
  home: {
    title: "Autorulota Bluey | Închiriere autorulotă din 90€/noapte",
    description:
      "Închiriază autorulota Bluey — Fiat Ducato 2026, 5 locuri, de la 90€/noapte. Travel & Educate: 90% din profit pentru elevi din Pogăceaua și Cristești, jud. Mureș.",
    ogImage: "/images/bluey-poiana.jpg",
    ogImageAlt:
      "Autorulota Bluey pe o poiană din România, cu peisaj montan în fundal",
    canonicalPath: "/",
  },
  misiune: {
    title: "Misiune socială — abandon școlar, Mureș | Bluey",
    description:
      "Excursii educative și tabere gratuite pentru elevii din Pogăceaua și Cristești, jud. Mureș. Autorulota Bluey — Travel & Educate împotriva abandonului școlar.",
    ogImage: "/images/bluey-pajiste.jpg",
    ogImageAlt: "Autorulota Bluey pe o pajișe verde din România",
    canonicalPath: "/misiunea-sociala",
  },
  rezervare: {
    title: "Rezervare autorulotă Bluey | de la 90€/noapte",
    description:
      "Tarife, dotări și condiții pentru închirierea Autorulotei Bluey — Fiat Ducato 2026, 5 locuri, jud. Mureș. Extrasezon 90€, sezon de vârf 140€/noapte.",
    ogImage: "/images/bluey-copertina.jpg",
    ogImageAlt:
      "Autorulota Bluey cu copertina deschisă, pregătită pentru o pauză",
    canonicalPath: "/rezervare",
  },
  defaultTitle: "Autorulota Bluey | Travel and Educate",
  defaultDescription:
    "Autorulotă Bluey — Travel & Educate: călătorii educative în România și misiune socială pentru elevii din mediul rural.",
} as const;
