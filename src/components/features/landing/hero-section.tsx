import { AnimatedComboNotation } from "@/components/features/landing/animated-combo-notation";
import { FgcTerm } from "@/components/features/landing/fgc-term";
import { HeroProductMock } from "@/components/features/landing/hero-product-mock";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Command } from "lucide-react";
import Link from "next/link";

type HeroSectionProps = {
  className?: string;
};

export function HeroSection(props: HeroSectionProps) {
  const { className } = props;

  return (
    <section
      className={cn(
        "bg-fgc-bg text-fgc-text relative overflow-hidden",
        className,
      )}
    >
      <div className="bg-grain pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay" />
      <div
        className="absolute inset-x-0 top-0 -z-0 h-[60%] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 30% 0%, var(--fgc-accent-soft) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--fgc-border) 30%, var(--fgc-border) 70%, transparent)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pt-24 pb-20 sm:px-6 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-16 md:pt-32 md:pb-28 lg:px-8">
        <div className="flex flex-col">
          <div
            className="fgc-rise border-fgc-border bg-fgc-surface/70 text-fgc-muted mb-6 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 backdrop-blur"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="bg-accent-fgc relative flex size-1.5 rounded-full">
              <span className="bg-accent-fgc absolute inset-0 animate-ping rounded-full opacity-60" />
            </span>
            <span className="font-mono-fgc text-[10px] tracking-[0.2em] uppercase">
              SF6 · Tekken 8 · GG Strive
            </span>
          </div>

          <h1
            className="marketing-h1 fgc-rise text-fgc-text text-5xl md:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.15s" }}
          >
            Download tes adversaires.
            <br />
            <span className="text-fgc-muted">Retiens chaque combo.</span>
            <br />
            <span className="text-accent-fgc">Monte en ranked.</span>
          </h1>

          <p
            className="fgc-rise text-fgc-muted mt-8 max-w-xl text-base leading-relaxed md:text-lg"
            style={{ animationDelay: "0.3s" }}
          >
            ComboTrack centralise tes notes timestampées sur YouTube, ton
            carnet de combos par perso, tes matrices de{" "}
            <FgcTerm term="matchup">matchup</FgcTerm> stratégiques, tes mémos
            personnels et un rapport d&apos;analyse par IA. Tout est connecté, tout
            est retrouvable en une recherche.
          </p>

          <div
            className="fgc-rise mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "0.45s" }}
          >
            <Button
              asChild
              size="lg"
              className="bg-accent-fgc hover:bg-accent-fgc-strong h-12 text-base text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_20px_40px_-10px_var(--fgc-accent-soft)]"
            >
              <Link href="/signup" className="flex items-center gap-2">
                Commencer gratuitement
                <ArrowRight className="size-4" />
              </Link>
            </Button>

            <button
              type="button"
              className="border-fgc-border bg-fgc-surface text-fgc-muted hover:text-fgc-text hover:border-fgc-muted/50 inline-flex h-12 items-center gap-2 rounded-md border px-4 text-sm transition-colors"
              data-cmdk-trigger
            >
              <Command className="size-3.5" />
              <span className="font-mono-fgc tracking-wider">⌘K</span>
              <span>Essayer la recherche</span>
            </button>
          </div>

          <div
            className="fgc-rise text-fgc-muted mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs"
            style={{ animationDelay: "0.6s" }}
          >
            <span>Gratuit pour toujours</span>
            <span className="bg-fgc-border size-1 rounded-full" />
            <span>Pas de CB requise</span>
            <span className="bg-fgc-border size-1 rounded-full" />
            <span>Aucune installation</span>
          </div>

          <div
            className="fgc-rise border-fgc-border mt-10 inline-flex w-fit items-center gap-3 rounded-md border-l-2 border-l-transparent pl-3"
            style={{ animationDelay: "0.75s" }}
          >
            <span className="font-mono-fgc text-fgc-muted text-[10px] tracking-widest uppercase">
              Notation
            </span>
            <AnimatedComboNotation
              combos={[
                "236P > 5HP > 214K > 236236P",
                "5MK > 2HP xx OD DP",
                "j.HK > 5MP > 5HK xx CA",
                "DR > 5HP > 2MK xx 236K~K",
              ]}
              className="text-sm md:text-base"
            />
          </div>
        </div>

        <div
          className="fgc-rise relative"
          style={{ animationDelay: "0.4s" }}
        >
          <div
            className="bg-accent-fgc-soft absolute -inset-4 -z-10 rounded-3xl blur-2xl"
            aria-hidden
          />
          <HeroProductMock />
        </div>
      </div>
    </section>
  );
}
