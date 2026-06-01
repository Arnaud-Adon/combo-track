import { BenefitsBento } from "@/components/features/landing/benefits-bento";
import { CmdkShowcaseSection } from "@/components/features/landing/cmdk-showcase-section";
import { CtaSection } from "@/components/features/landing/cta-section";
import { FaqSection } from "@/components/features/landing/faq-section";
import { HeroSection } from "@/components/features/landing/hero-section";
import { MobileCtaBar } from "@/components/features/landing/mobile-cta-bar";
import { NotionVsCombotrackSection } from "@/components/features/landing/notion-vs-combotrack-section";
import { PricingSection } from "@/components/features/landing/pricing-section";
import { ProblemSection } from "@/components/features/landing/problem-section";
import { ProductWalkthroughSection } from "@/components/features/landing/product-walkthrough-section";
import { SolutionSection } from "@/components/features/landing/solution-section";
import { TestimonialsSection } from "@/components/features/landing/testimonials-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <BenefitsBento />
      <ProductWalkthroughSection />
      <CmdkShowcaseSection />
      <NotionVsCombotrackSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <MobileCtaBar />
    </>
  );
}
