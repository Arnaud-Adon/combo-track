import { cn } from "@/lib/utils";
import { MessageSquareOff, NotebookPen, RotateCcw } from "lucide-react";

type ProblemSectionProps = {
  className?: string;
};

const PAINS = [
  {
    icon: MessageSquareOff,
    title: "Tes notes de replay ne servent à rien",
    body: "Tu regardes un match sur YouTube, tu remarques un setup intéressant. Tu l'écris dans un message Discord. Deux jours plus tard, impossible de le retrouver. Ce pattern se répète depuis des mois.",
  },
  {
    icon: NotebookPen,
    title: "Tes combos disparaissent entre deux sessions",
    body: "Tu lab un combo pendant 45 minutes, tu le rentres 50 fois. Le lendemain en ranked, tu peux plus le replacer. Parce qu'il était dans ta tête, pas quelque part de fiable.",
  },
  {
    icon: RotateCcw,
    title: "Chaque matchup difficile, tu repars de zéro",
    body: "Tu joues contre le même perso pour la dixième fois. Tu as les mêmes lacunes qu'il y a trois semaines. Parce que tu n'as jamais écrit ce qui marchait — et ce qui ne marchait pas.",
  },
];

export function ProblemSection(props: ProblemSectionProps) {
  const { className } = props;

  return (
    <section
      id="problem"
      className={cn(
        "bg-fgc-bg text-fgc-text relative overflow-hidden border-t",
        "border-fgc-border",
        className,
      )}
    >
      <div className="bg-scanlines pointer-events-none absolute inset-0 opacity-50" />
      <div className="bg-grain pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay" />

      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <span className="font-mono-fgc text-accent-fgc mb-4 inline-block text-[10px] tracking-[0.3em] uppercase">
            {"// Problème"}
          </span>
          <h2 className="marketing-h1 text-fgc-text text-4xl md:text-5xl lg:text-6xl">
            Tu analyses.
            <span className="text-fgc-muted"> Tu oublies.</span>
            <br />
            Tu recommences.
          </h2>
        </div>

        <div className="grid gap-px md:grid-cols-3">
          {PAINS.map((pain, idx) => {
            const Icon = pain.icon;
            return (
              <div
                key={pain.title}
                className="border-fgc-border bg-fgc-surface/40 hover:bg-fgc-surface group relative border p-6 transition-colors md:p-7"
              >
                <span className="font-mono-fgc text-fgc-muted absolute top-4 right-5 text-[10px] tracking-widest">
                  0{idx + 1}
                </span>
                <Icon className="text-accent-fgc mb-5 size-6" strokeWidth={1.5} />
                <h3 className="text-fgc-text mb-3 text-lg font-semibold">
                  {pain.title}
                </h3>
                <p className="text-fgc-muted text-sm leading-relaxed">
                  {pain.body}
                </p>
              </div>
            );
          })}
        </div>

        <div className="border-accent-fgc/40 bg-fgc-surface/40 relative mt-12 border-l-2 py-5 pr-6 pl-6 md:mt-16">
          <p className="text-fgc-text text-base leading-relaxed md:text-lg">
            Le problème, c&apos;est pas le manque de motivation. Tu regardes des
            VODs, tu lab, tu analyses. Le problème, c&apos;est que tout ce
            travail disparaît. Dispersé dans dix outils qui ne se parlent pas,
            perdu dans des messages Discord introuvables, évaporé après le
            prochain patch.{" "}
            <span className="text-fgc-text font-semibold">
              Le grind sans système, c&apos;est du grind à vide.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
