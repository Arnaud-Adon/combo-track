import { FgcTerm } from "@/components/features/landing/fgc-term";
import { cn } from "@/lib/utils";

type SolutionSectionProps = {
  className?: string;
};

export function SolutionSection(props: SolutionSectionProps) {
  const { className } = props;

  return (
    <section
      id="solution"
      className={cn(
        "bg-fgc-bg text-fgc-text relative border-t",
        "border-fgc-border",
        className,
      )}
    >
      <div
        className="absolute inset-x-0 top-0 -z-0 h-full opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 0%, var(--fgc-accent-soft) 0%, transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 md:py-32 lg:px-8">
        <span className="font-mono-fgc text-accent-fgc mb-4 inline-block text-[10px] tracking-[0.3em] uppercase">
          {"// Solution"}
        </span>
        <h2 className="marketing-h1 text-fgc-text mx-auto max-w-3xl text-balance text-4xl md:text-5xl lg:text-6xl">
          Un seul endroit pour
          <br />
          <span className="text-accent-fgc">tout ce qui te fait progresser.</span>
        </h2>

        <p className="text-fgc-muted mx-auto mt-8 max-w-2xl text-base leading-relaxed md:text-lg">
          ComboTrack connecte tes replays, tes combos, tes matchups et tes
          mémos dans un seul <FgcTerm term="lab">labo</FgcTerm> dédié à la FGC.
          Ce que tu observes en vidéo devient un combo dans ton carnet. Ce que
          tu comprends d&apos;un matchup devient une matrice consultable avant
          ton prochain set. Ce qui te passe par la tête en plein lab devient un
          mémo retrouvable en deux frappes (⌘K). L&apos;IA synthétise ce que
          tu n&apos;as pas vu seul.
        </p>
      </div>
    </section>
  );
}
