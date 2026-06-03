import { PageShell } from "@/components/PageShell";
import { ComuneSection } from "@/components/misiune/ComuneSection";
import { ImpactCards } from "@/components/misiune/ImpactCards";
import { MisiuneCta } from "@/components/misiune/MisiuneCta";
import { MisiuneHero } from "@/components/misiune/MisiuneHero";
import { TravelEducateBlock } from "@/components/misiune/TravelEducateBlock";
import { IMAGES } from "@/data/images";
import { SEO } from "@/data/site";
import { buildPageHead } from "@/lib/seoHead";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/misiunea-sociala")({
  head: () =>
    buildPageHead(SEO.misiune, {
      preloadImages: [IMAGES.pajisteHero.src],
    }),
  component: MisiunePage,
});

function MisiunePage() {
  return (
    <PageShell>
      <MisiuneHero />
      <TravelEducateBlock />
      <ImpactCards />
      <ComuneSection />
      <MisiuneCta />
    </PageShell>
  );
}
