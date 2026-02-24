import { HomeHero } from "@/components/site/home-hero";
import { TrustBar } from "@/components/site/trust-bar";
import { ImpactStats } from "@/components/site/impact-stats";
import { ProgramsGrid } from "@/components/site/programs-grid";

import { ImpactGallery } from "@/components/site/impact-gallery";
import { StoriesSlider } from "@/components/site/stories-slider";
import { CtaBand } from "@/components/site/cta-band";
import { PartnersStrip } from "@/components/site/partners-strip";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <TrustBar />
      <PartnersStrip />
      <ImpactStats />
      <ProgramsGrid />
      <ImpactGallery />
      <StoriesSlider />
      <CtaBand />
    </>
  );
}
