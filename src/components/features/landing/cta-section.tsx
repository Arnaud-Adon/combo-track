import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type CtaSectionProps = {
  className?: string;
};

export function CtaSection(props: CtaSectionProps) {
  const { className } = props;

  return (
    <section
      className={cn(
        "bg-accent/10 flex flex-col items-center justify-center px-4 py-20 text-center",
        className,
      )}
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          Ready to Dominate?
        </h2>
        <p className="text-muted-foreground mb-8 text-lg md:text-xl">
          Join players improving their game with ComboTrack
        </p>
        <Button asChild size="lg" className="text-base">
          <Link href="/videos">Start Taking Notes</Link>
        </Button>
      </div>
    </section>
  );
}
