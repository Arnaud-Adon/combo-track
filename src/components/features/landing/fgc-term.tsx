import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const FGC_GLOSSARY: Record<string, string> = {
  bnb: "Bread and Butter — combo de base, fiable, ton outil par défaut quand l'occasion se présente.",
  oki: "Okizeme — pression et mix-up appliqués pendant le réveil de l'adversaire au sol.",
  neutral:
    "Phase de jeu où aucun joueur n'a l'avantage. Spacing, baits, whiff punish.",
  punish:
    "Punir un move adverse non sûr (gros startup, gros recovery) avec ton meilleur combo.",
  setup:
    "Situation reproductible que tu crées pour forcer un mix-up ou une lecture.",
  download:
    "Étudier méthodiquement un adversaire — ses habitudes, ses options, ses tells.",
  lab: "Training mode actif : tester, mesurer, valider une situation jusqu'à la maîtriser.",
  grind: "Effort répété et continu — sessions longues, intentionnelles.",
  matchup: "L'affrontement spécifique d'un perso contre un autre.",
  "frame data": "Données précises de chaque move : startup, active, recovery, advantage.",
  "whiff punish":
    "Punir un move qui rate (whiff) avec ton meilleur outil à portée.",
  "drive rush":
    "Mécanique de dash chargé en SF6 qui modifie le frame advantage. Move dans l'écosystème SF6.",
  meter: "La jauge — Drive en SF6, Heat en T8, Tension en Strive.",
  "frame trap":
    "Enchaînement laissant juste assez de frames pour piéger une pression adverse.",
  mixup: "Choisir entre deux options non-réagissables (high/low, left/right).",
};

type FgcTermProps = {
  term: keyof typeof FGC_GLOSSARY | string;
  children: React.ReactNode;
  className?: string;
};

export function FgcTerm(props: FgcTermProps) {
  const { term, children, className } = props;
  const definition = FGC_GLOSSARY[term.toLowerCase()];

  if (!definition) {
    return <span className={className}>{children}</span>;
  }

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "decoration-fgc-accent/60 hover:decoration-fgc-accent cursor-help underline decoration-dotted underline-offset-4 transition-colors",
              className,
            )}
          >
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="border-fgc-accent/30 bg-fgc-surface text-fgc-text max-w-xs border font-sans text-xs leading-relaxed"
        >
          <div className="text-fgc-accent font-mono-fgc mb-1 text-[10px] tracking-widest uppercase">
            {term}
          </div>
          {definition}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
