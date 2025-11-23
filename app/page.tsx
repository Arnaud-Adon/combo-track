import { CtaSection } from "@/components/features/landing/cta-section";
import { FeaturesSection } from "@/components/features/landing/features-section";
import { HeroSection } from "@/components/features/landing/hero-section";
import { HowItWorksSection } from "@/components/features/landing/how-it-works-section";

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
    </main>
  );
}
