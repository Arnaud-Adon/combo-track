import { cn } from "@/lib/utils";
import { MessageSquareOff, NotebookPen, RotateCcw } from "lucide-react";
import { getTranslations } from "next-intl/server";

type ProblemSectionProps = {
  className?: string;
};

export async function ProblemSection(props: ProblemSectionProps) {
  const { className } = props;

  const t = await getTranslations("landing");

  const pains = [
    {
      icon: MessageSquareOff,
      title: t("problem.pains.notes.title"),
      body: t("problem.pains.notes.body"),
    },
    {
      icon: NotebookPen,
      title: t("problem.pains.combos.title"),
      body: t("problem.pains.combos.body"),
    },
    {
      icon: RotateCcw,
      title: t("problem.pains.matchup.title"),
      body: t("problem.pains.matchup.body"),
    },
  ];

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
          <span className="font-mono-fgc text-fgc-accent mb-4 inline-block text-[10px] tracking-[0.3em] uppercase">
            {t("problem.eyebrow")}
          </span>
          <h2 className="marketing-h1 text-fgc-text text-4xl md:text-5xl lg:text-6xl">
            {t("problem.titlePart1")}
            <span className="text-fgc-muted">{t("problem.titlePart2")}</span>
            <br />
            {t("problem.titlePart3")}
          </h2>
        </div>

        <div className="grid gap-px md:grid-cols-3">
          {pains.map((pain, idx) => {
            const Icon = pain.icon;
            return (
              <div
                key={pain.title}
                className="border-fgc-border bg-fgc-surface/40 hover:bg-fgc-surface group relative border p-6 transition-colors md:p-7"
              >
                <span className="font-mono-fgc text-fgc-muted absolute top-4 right-5 text-[10px] tracking-widest">
                  0{idx + 1}
                </span>
                <Icon className="text-fgc-accent mb-5 size-6" strokeWidth={1.5} />
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

        <div className="border-fgc-accent/40 bg-fgc-surface/40 relative mt-12 border-l-2 py-5 pr-6 pl-6 md:mt-16">
          <p className="text-fgc-text text-base leading-relaxed md:text-lg">
            {t.rich("problem.conclusion", {
              strong: (chunks) => (
                <span className="text-fgc-text font-semibold">{chunks}</span>
              ),
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
