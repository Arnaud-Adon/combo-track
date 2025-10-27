import { CtaSection } from "@/components/features/landing/cta-section";
import { FeaturesSection } from "@/components/features/landing/features-section";
import { Footer } from "@/components/features/landing/footer";
import { LandingHeader } from "@/components/features/landing/header";
import { HeroSection } from "@/components/features/landing/hero-section";
import { HowItWorksSection } from "@/components/features/landing/how-it-works-section";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
