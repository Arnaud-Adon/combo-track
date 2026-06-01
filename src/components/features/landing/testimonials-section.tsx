import { cn } from "@/lib/utils";
import { Quote, Shield } from "lucide-react";

type TestimonialsSectionProps = {
  className?: string;
};

const QUOTES = [
  {
    quote:
      "Je regardais des VODs depuis des mois sans progresser. Depuis ComboTrack, chaque session d'analyse génère des combos dans mon carnet et une matrice à réviser. Mon rank a monté d'une division en trois semaines.",
    name: "Théo M.",
    main: "Kazuya",
    game: "Tekken 8",
    rank: "Kishin",
  },
  {
    quote:
      "Le rapport AI après mes matchs de tournoi est incroyable. Il identifie exactement le pattern que je répète sans m'en rendre compte. C'est comme avoir un coach qui a regardé tous mes sets.",
    name: "Sarah K.",
    main: "Cammy",
    game: "SF6",
    rank: "Master",
  },
  {
    quote:
      "La Strategy Matrix avant un tournoi local, c'est devenu mon ritual. Je prépare les matchups difficiles la veille, je consulte sur mon téléphone entre les sets. Ça m'a sauvé deux fois en bracket.",
    name: "Marc D.",
    main: "Ramlethal",
    game: "GG Strive",
    rank: "Top 8 local",
  },
];

const TRUST = [
  "Compatible SF6, Tekken 8, Guilty Gear Strive",
  "Données 100% privées — tes notes appartiennent à toi",
  "Fonctionne sur tous les navigateurs, aucune installation",
];

export function TestimonialsSection(props: TestimonialsSectionProps) {
  const { className } = props;

  return (
    <section
      className={cn(
        "bg-fgc-bg text-fgc-text relative border-t",
        "border-fgc-border",
        className,
      )}
    >
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="mb-12 max-w-2xl md:mb-16">
          <span className="font-mono-fgc text-fgc-accent mb-4 inline-block text-[10px] tracking-[0.3em] uppercase">
            {"// Témoignages"}
          </span>
          <h2 className="marketing-h1 text-fgc-text text-4xl md:text-5xl lg:text-6xl">
            Ce que disent les joueurs
            <br />
            <span className="text-fgc-muted">qui l&apos;utilisent.</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-5">
          {QUOTES.map((q) => (
            <article
              key={q.name}
              className="border-fgc-border bg-fgc-surface/40 hover:bg-fgc-surface hover:border-fgc-accent/30 group relative flex flex-col gap-5 rounded-md border p-6 transition-colors md:p-7"
            >
              <Quote
                className="text-fgc-accent/60 size-5"
                strokeWidth={2}
                aria-hidden
              />
              <p className="text-fgc-text text-sm leading-relaxed">
                {q.quote}
              </p>

              <div className="border-fgc-border mt-auto flex items-center gap-3 border-t pt-4">
                <span className="border-fgc-accent/40 bg-fgc-accent-soft text-fgc-accent font-mono-fgc flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold">
                  {q.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-fgc-text text-sm font-medium">
                    {q.name}
                  </div>
                  <div className="text-fgc-muted font-mono-fgc text-[10px] tracking-wider uppercase">
                    {q.game} · {q.main} · {q.rank}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="border-fgc-border mt-16 grid gap-px border-t md:grid-cols-3">
          {TRUST.map((t) => (
            <div
              key={t}
              className="text-fgc-muted flex items-start gap-3 py-5 text-sm md:py-6"
            >
              <Shield className="text-fgc-accent mt-0.5 size-4 shrink-0" />
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
