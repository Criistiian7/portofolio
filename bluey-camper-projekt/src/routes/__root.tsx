import { ContactModalProvider } from "@/context/ContactModalContext";
import { BRAND_LOGO, SEO, SITE, SOCIAL_LINKS } from "@/data/site";
import { absoluteUrl, getSiteOrigin } from "@/lib/absoluteUrl";
import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";

const siteOrigin = getSiteOrigin();

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.brand,
  description: SITE.mission.summary,
  ...(siteOrigin ? { url: siteOrigin } : {}),
  logo: absoluteUrl(BRAND_LOGO.src),
  telephone: "+40-742-652-698",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+40-742-652-698",
    contactType: "customer service",
    areaServed: "RO",
    availableLanguage: ["ro"],
  },
  sameAs: SOCIAL_LINKS.map((link) => link.href),
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: SEO.defaultTitle },
      { name: "description", content: SEO.defaultDescription },
    ],
    links: [{ rel: "icon", href: BRAND_LOGO.src, type: "image/png" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(organizationJsonLd),
      },
    ],
  }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <ContactModalProvider>
      <a
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:block focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand focus:shadow-lg focus:outline-none"
      >
        Sari la conținut
      </a>
      <HeadContent />
      <Outlet />
    </ContactModalProvider>
  );
}
