import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type CtaSectionProps = {
  className?: string;
};

export function CtaSection(props: CtaSectionProps) {
  const { className } = props;

  return (
    <section
      className={cn(
        "bg-fgc-bg text-fgc-text relative overflow-hidden border-t",
        "border-fgc-border",
        className,
      )}
    >
      <div
        className="absolute inset-0 -z-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 100%, var(--fgc-accent-soft) 0%, transparent 70%)",
        }}
      />
      <div className="bg-grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" />

      <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 md:py-32 lg:px-8">
        <span className="font-mono-fgc text-accent-fgc mb-4 inline-block text-[10px] tracking-[0.3em] uppercase">
          {"// Game on"}
        </span>
        <h2 className="marketing-h1 text-fgc-text mx-auto max-w-2xl text-balance text-4xl md:text-5xl lg:text-6xl">
          Ton prochain rank
          <br />
          <span className="text-accent-fgc">commence ici.</span>
        </h2>
        <p className="text-fgc-muted mx-auto mt-8 max-w-xl text-base leading-relaxed md:text-lg">
          Les matchs que tu regardes en boucle sans progresser — c&apos;est
          derrière toi. ComboTrack transforme chaque replay en plan de lab,
          chaque observation en combo structuré, chaque matchup difficile en
          matrice consultable.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-accent-fgc hover:bg-accent-fgc-strong h-12 text-base text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_20px_50px_-10px_var(--fgc-accent-soft)]"
          >
            <Link href="/signup" className="flex items-center gap-2">
              Commencer gratuitement — c&apos;est immédiat
              <ArrowRight className="size-4" />
            </Link>
          </Button>

          <div className="text-fgc-muted mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
            <span>Gratuit pour toujours</span>
            <span className="bg-fgc-border size-1 rounded-full" />
            <span>Pas de CB</span>
            <span className="bg-fgc-border size-1 rounded-full" />
            <span>Annulable à tout moment</span>
          </div>
        </div>
      </div>
    </section>
  );
}
