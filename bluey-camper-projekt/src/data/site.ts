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

const WHATSAPP_PHONE = "40742652698";

const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(SITE.whatsappMessage)}`;

export const CONTACT = {
  tel: SITE.phoneTel,
  whatsappUrl,
} as const;

export const SEO = {
  home: {
    title: "Autorulota Bluey | Călătorii educative în România",
    description:
      "Autorulotă pentru călătorii educative în România — Travel & Educate. 90% din profit pentru elevi din Pogăceaua și Cristești, jud. Mureș, în lupta cu abandonul școlar.",
    ogImage: "/images/bluey-poiana.jpg",
    ogImageAlt:
      "Autorulota Bluey pe o poiană din România, cu peisaj montan în fundal",
  },
  misiune: {
    title: "Misiune socială — abandon școlar, Mureș | Bluey",
    description:
      "Excursii educative și tabere gratuite pentru elevii din Pogăceaua și Cristești, jud. Mureș. Autorulota Bluey — Travel & Educate împotriva abandonului școlar.",
    ogImage: "/images/bluey-pajiste.jpg",
    ogImageAlt: "Autorulota Bluey pe o pajișe verde din România",
  },
  defaultTitle: "Autorulota Bluey | Travel and Educate",
  defaultDescription:
    "Autorulotă Bluey — Travel & Educate: călătorii educative în România și misiune socială pentru elevii din mediul rural.",
} as const;
