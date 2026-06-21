import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { getTranslations } from "next-intl/server";

type NotionVsCombotrackSectionProps = {
  className?: string;
};

const ROW_FLAGS = [
  { notion: false, combotrack: true },
  { notion: false, combotrack: true },
  { notion: false, combotrack: true },
  { notion: false, combotrack: true },
  { notion: false, combotrack: true },
  { notion: false, combotrack: true },
  { notion: true, combotrack: false },
];

export async function NotionVsCombotrackSection(
  props: NotionVsCombotrackSectionProps,
) {
  const { className } = props;

  const t = await getTranslations("landing");
  const features = t.raw("comparison.rows") as string[];
  const rows = ROW_FLAGS.map((flags, idx) => ({
    feature: features[idx],
    ...flags,
  }));

  return (
    <section
      className={cn(
        "bg-fgc-bg text-fgc-text relative border-t",
        "border-fgc-border",
        className,
      )}
    >
      <div className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="mb-12 max-w-2xl md:mb-16">
          <span className="font-mono-fgc text-fgc-accent mb-4 inline-block text-[10px] tracking-[0.3em] uppercase">
            {t("comparison.eyebrow")}
          </span>
          <h2 className="marketing-h1 text-fgc-text text-4xl md:text-5xl lg:text-6xl">
            {t("comparison.titlePart1")}
            <br />
            <span className="text-fgc-muted">{t("comparison.titleHighlight")}</span>
          </h2>
          <p className="text-fgc-muted mt-6 max-w-xl text-sm leading-relaxed md:text-base">
            {t("comparison.intro")}
          </p>
        </div>

        <div className="border-fgc-border bg-fgc-surface overflow-hidden rounded-xl border">
          <div className="border-fgc-border bg-fgc-bg/60 grid grid-cols-[1fr_auto_auto] gap-4 border-b px-5 py-3 md:gap-12 md:px-8">
            <span className="text-fgc-muted font-mono-fgc text-[10px] tracking-wider uppercase">
              {t("comparison.headerCapability")}
            </span>
            <span className="text-fgc-muted font-mono-fgc w-16 text-center text-[10px] tracking-wider uppercase md:w-24">
              Notion
            </span>
            <span className="text-fgc-accent font-mono-fgc w-20 text-center text-[10px] font-bold tracking-wider uppercase md:w-28">
              ComboTrack
            </span>
          </div>

          <div className="divide-fgc-border divide-y">
            {rows.map((row) => (
              <div
                key={row.feature}
                className="hover:bg-fgc-bg/40 grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4 transition-colors md:gap-12 md:px-8"
              >
                <span className="text-fgc-text text-sm md:text-base">
                  {row.feature}
                </span>
                <span className="flex w-16 justify-center md:w-24">
                  {row.notion ? (
                    <Check className="text-fgc-muted size-5" strokeWidth={2.5} />
                  ) : (
                    <X className="text-fgc-muted/50 size-5" strokeWidth={2} />
                  )}
                </span>
                <span className="flex w-20 justify-center md:w-28">
                  {row.combotrack ? (
                    <span className="border-fgc-accent/40 bg-fgc-accent-soft inline-flex size-7 items-center justify-center rounded-sm border">
                      <Check className="text-fgc-accent size-4" strokeWidth={2.5} />
                    </span>
                  ) : (
                    <X className="text-fgc-muted/40 size-5" strokeWidth={2} />
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
