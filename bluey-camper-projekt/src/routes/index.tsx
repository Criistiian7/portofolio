import { PageShell } from "@/components/PageShell";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { HeroSection } from "@/components/home/HeroSection";
import { ImpactBand } from "@/components/home/ImpactBand";
import { IMAGES } from "@/data/images";
import { SEO } from "@/data/site";
import { buildPageHead } from "@/lib/seoHead";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const GallerySection = lazy(() =>
  import("@/components/home/GallerySection").then((m) => ({
    default: m.GallerySection,
  })),
);
const SocialSection = lazy(() =>
  import("@/components/home/SocialSection").then((m) => ({
    default: m.SocialSection,
  })),
);

export const Route = createFileRoute("/")({
  head: () =>
    buildPageHead(SEO.home, {
      preloadImages: [IMAGES.hero.src],
    }),
  component: HomePage,
});

function HomePage() {
  return (
    <PageShell>
      <HeroSection />
      <ImpactBand />
      <FeaturesGrid />
      <Suspense fallback={null}>
        <GallerySection />
        <SocialSection />
      </Suspense>
    </PageShell>
  );
}
