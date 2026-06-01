import { cn } from "@/lib/utils";
import {
  BookOpen,
  Command,
  Grid3x3,
  PlayCircle,
  Sparkles,
  StickyNote,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type BenefitsBentoProps = {
  className?: string;
};

type Benefit = {
  icon: LucideIcon;
  tag: string;
  title: string;
  body: string;
  span: string;
  accent?: boolean;
};

const BENEFITS: Benefit[] = [
  {
    icon: PlayCircle,
    tag: "Match Notebook",
    title: "Notes timestampées. Rien ne se perd.",
    body: "Tu colles l'URL de n'importe quelle vidéo YouTube. Tu annotes au bon moment : combo punish, oki setup, erreur de neutral. Chaque note est liée au timecode exact. Dans six mois, tu retrouves tout en trois secondes.",
    span: "md:col-span-2",
    accent: true,
  },
  {
    icon: BookOpen,
    tag: "Combo Notebook",
    title: "Tes BnBs. Structurés. Par perso.",
    body: "Chaque combo a sa fiche : notation, dégâts, meter, difficulté, tags. Lié à la vidéo source. Ton carnet évolue avec toi — pas avec le prochain patch.",
    span: "md:col-span-1",
  },
  {
    icon: Grid3x3,
    tag: "Strategy Matrix",
    title: "Prépare chaque matchup avant d'entrer en jeu.",
    body: "Crée une matrice pour un adversaire précis : tes options face à ses options. Remplis les cellules — ou laisse l'IA les générer en 10 secondes. Épingle, consulte avant ton set.",
    span: "md:col-span-1",
  },
  {
    icon: Sparkles,
    tag: "AI Match Report",
    title: "L'IA qui voit ce que tu as raté.",
    body: "Génère un rapport complet en un clic : résumé, points forts, UN point faible prioritaire, moments clés horodatés, exercices concrets pour ta prochaine session de lab.",
    span: "md:col-span-2",
    accent: true,
  },
  {
    icon: StickyNote,
    tag: "Mémos",
    title: "Capture une idée en 5 secondes.",
    body: "Une intuition pendant le lab, une routine d'échauffement, une checklist pré-tournoi. Pas besoin d'un match ni d'un perso. Indexé avec tout le reste.",
    span: "md:col-span-1",
  },
  {
    icon: Command,
    tag: "Recherche ⌘K",
    title: "Tout ton labo, à une frappe.",
    body: "Recherche sémantique. Tape « anti-air dive kick » et retrouve ta note où tu avais écrit « DP punish jump-in Akuma ». Plus besoin de te souvenir des mots exacts.",
    span: "md:col-span-2",
  },
];

export function BenefitsBento(props: BenefitsBentoProps) {
  const { className } = props;

  return (
    <section
      id="benefits"
      className={cn(
        "bg-fgc-bg text-fgc-text relative border-t",
        "border-fgc-border",
        className,
      )}
    >
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="mb-12 flex flex-col items-start gap-3 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="font-mono-fgc text-accent-fgc mb-4 inline-block text-[10px] tracking-[0.3em] uppercase">
              {"// Bénéfices"}
            </span>
            <h2 className="marketing-h1 text-fgc-text text-4xl md:text-5xl lg:text-6xl">
              Six modules.
              <br />
              <span className="text-fgc-muted">Un seul flux.</span>
            </h2>
          </div>
          <p className="text-fgc-muted max-w-md text-sm leading-relaxed md:text-base">
            Tout ce qu&apos;un joueur compétitif fait après une session — annoter,
            structurer, comparer, synthétiser, retrouver. Au même endroit.
          </p>
        </div>

        <div className="grid auto-rows-fr gap-px md:grid-cols-3">
          {BENEFITS.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <article
                key={benefit.title}
                className={cn(
                  "border-fgc-border bg-fgc-surface/40 hover:bg-fgc-surface group relative flex flex-col gap-4 border p-6 transition-colors md:p-8",
                  benefit.span,
                  benefit.accent &&
                    "hover:border-accent-fgc/40 [&_.bento-tag]:text-accent-fgc",
                )}
              >
                <span className="font-mono-fgc text-fgc-muted absolute top-5 right-6 text-[10px] tracking-widest">
                  0{idx + 1}
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "border-fgc-border bg-fgc-bg flex size-9 items-center justify-center rounded-sm border",
                      benefit.accent && "border-accent-fgc/40 bg-accent-fgc-soft",
                    )}
                  >
                    <Icon
                      className={cn(
                        "text-fgc-text size-4",
                        benefit.accent && "text-accent-fgc",
                      )}
                      strokeWidth={1.6}
                    />
                  </span>
                  <span className="bento-tag text-fgc-muted font-mono-fgc text-[10px] tracking-[0.2em] uppercase">
                    {benefit.tag}
                  </span>
                </div>

                <h3 className="text-fgc-text text-xl leading-tight font-semibold md:text-2xl">
                  {benefit.title}
                </h3>

                <p className="text-fgc-muted text-sm leading-relaxed">
                  {benefit.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
