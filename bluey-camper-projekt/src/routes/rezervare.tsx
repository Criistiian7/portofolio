import { PageShell } from "@/components/PageShell";
import { AmenitiesSection } from "@/components/rezervare/AmenitiesSection";
import { BedsSection } from "@/components/rezervare/BedsSection";
import { DiscountsSection } from "@/components/rezervare/DiscountsSection";
import { PricingSection } from "@/components/rezervare/PricingSection";
import { RezervareCtaSection } from "@/components/rezervare/RezervareCtaSection";
import { RezervareHero } from "@/components/rezervare/RezervareHero";
import { TermsSection } from "@/components/rezervare/TermsSection";
import { SEO } from "@/data/site";
import { buildRezervareOfferJsonLd } from "@/lib/bookingJsonLd";
import { buildPageHead } from "@/lib/seoHead";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rezervare")({
  head: () =>
    buildPageHead(SEO.rezervare, {
      jsonLd: buildRezervareOfferJsonLd(),
    }),
  component: RezervarePage,
});

function RezervarePage() {
  return (
    <PageShell showMobileBookingBar>
      <RezervareHero />
      <PricingSection />
      <DiscountsSection />
      <BedsSection />
      <AmenitiesSection />
      <TermsSection />
      <RezervareCtaSection />
    </PageShell>
  );
}
