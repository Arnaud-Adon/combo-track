import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

type FgcTermProps = {
  term: string;
  children: React.ReactNode;
  className?: string;
};

export async function FgcTerm(props: FgcTermProps) {
  const { term, children, className } = props;
  const t = await getTranslations("landing");

  const definitions: Record<string, string> = {
    bnb: t("fgcTerm.bnb"),
    oki: t("fgcTerm.oki"),
    neutral: t("fgcTerm.neutral"),
    punish: t("fgcTerm.punish"),
    setup: t("fgcTerm.setup"),
    download: t("fgcTerm.download"),
    lab: t("fgcTerm.lab"),
    grind: t("fgcTerm.grind"),
    matchup: t("fgcTerm.matchup"),
    "frame data": t("fgcTerm.frameData"),
    "whiff punish": t("fgcTerm.whiffPunish"),
    "drive rush": t("fgcTerm.driveRush"),
    meter: t("fgcTerm.meter"),
    "frame trap": t("fgcTerm.frameTrap"),
    mixup: t("fgcTerm.mixup"),
  };

  const definition = definitions[term.toLowerCase()];

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
