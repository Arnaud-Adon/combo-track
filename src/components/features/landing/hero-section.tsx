import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type HeroSectionProps = {
  className?: string;
};

export function HeroSection(props: HeroSectionProps) {
  const { className } = props;

  return (
    <section
      className={cn(
        "relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 py-20",
        className,
      )}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-accent/5 to-background" />

      <div className="mx-auto max-w-4xl text-center">
        <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-5xl font-bold leading-tight tracking-tight text-transparent md:text-7xl">
          Level Up Your Gameplay with ComboTrack
        </h1>

        <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg md:text-xl">
          Stop rewatching the same matches over and over. Drop timestamped
          notes on your fighting game replays and actually remember what you
          learned. Get good, faster.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="text-base">
            <Link href="/videos">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-base">
            <Link href="#how-it-works">Watch Demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
