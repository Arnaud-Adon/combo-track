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
import { getTranslations } from "next-intl/server";

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

export async function BenefitsBento(props: BenefitsBentoProps) {
  const { className } = props;

  const t = await getTranslations("landing");

  const benefits: Benefit[] = [
    {
      icon: PlayCircle,
      tag: t("benefits.items.matchNotebook.tag"),
      title: t("benefits.items.matchNotebook.title"),
      body: t("benefits.items.matchNotebook.body"),
      span: "md:col-span-2",
      accent: true,
    },
    {
      icon: BookOpen,
      tag: t("benefits.items.comboNotebook.tag"),
      title: t("benefits.items.comboNotebook.title"),
      body: t("benefits.items.comboNotebook.body"),
      span: "md:col-span-1",
    },
    {
      icon: Grid3x3,
      tag: t("benefits.items.strategyMatrix.tag"),
      title: t("benefits.items.strategyMatrix.title"),
      body: t("benefits.items.strategyMatrix.body"),
      span: "md:col-span-1",
    },
    {
      icon: Sparkles,
      tag: t("benefits.items.aiReport.tag"),
      title: t("benefits.items.aiReport.title"),
      body: t("benefits.items.aiReport.body"),
      span: "md:col-span-2",
      accent: true,
    },
    {
      icon: StickyNote,
      tag: t("benefits.items.memos.tag"),
      title: t("benefits.items.memos.title"),
      body: t("benefits.items.memos.body"),
      span: "md:col-span-1",
    },
    {
      icon: Command,
      tag: t("benefits.items.search.tag"),
      title: t("benefits.items.search.title"),
      body: t("benefits.items.search.body"),
      span: "md:col-span-2",
    },
  ];

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
            <span className="font-mono-fgc text-fgc-accent mb-4 inline-block text-[10px] tracking-[0.3em] uppercase">
              {t("benefits.eyebrow")}
            </span>
            <h2 className="marketing-h1 text-fgc-text text-4xl md:text-5xl lg:text-6xl">
              {t("benefits.titlePart1")}
              <br />
              <span className="text-fgc-muted">{t("benefits.titleHighlight")}</span>
            </h2>
          </div>
          <p className="text-fgc-muted max-w-md text-sm leading-relaxed md:text-base">
            {t("benefits.intro")}
          </p>
        </div>

        <div className="grid auto-rows-fr gap-px md:grid-cols-3">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <article
                key={benefit.title}
                className={cn(
                  "border-fgc-border bg-fgc-surface/40 hover:bg-fgc-surface group relative flex flex-col gap-4 border p-6 transition-colors md:p-8",
                  benefit.span,
                  benefit.accent &&
                    "hover:border-fgc-accent/40 [&_.bento-tag]:text-fgc-accent",
                )}
              >
                <span className="font-mono-fgc text-fgc-muted absolute top-5 right-6 text-[10px] tracking-widest">
                  0{idx + 1}
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "border-fgc-border bg-fgc-bg flex size-9 items-center justify-center rounded-sm border",
                      benefit.accent && "border-fgc-accent/40 bg-fgc-accent-soft",
                    )}
                  >
                    <Icon
                      className={cn(
                        "text-fgc-text size-4",
                        benefit.accent && "text-fgc-accent",
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
