import { FgcTerm } from "@/components/features/landing/fgc-term";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

type SolutionSectionProps = {
  className?: string;
};

export async function SolutionSection(props: SolutionSectionProps) {
  const { className } = props;

  const t = await getTranslations("landing");

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
        <span className="font-mono-fgc text-fgc-accent mb-4 inline-block text-[10px] tracking-[0.3em] uppercase">
          {t("solution.eyebrow")}
        </span>
        <h2 className="marketing-h1 text-fgc-text mx-auto max-w-3xl text-balance text-4xl md:text-5xl lg:text-6xl">
          {t("solution.titlePart1")}
          <br />
          <span className="text-fgc-accent">{t("solution.titleHighlight")}</span>
        </h2>

        <p className="text-fgc-muted mx-auto mt-8 max-w-2xl text-base leading-relaxed md:text-lg">
          {t.rich("solution.description", {
            lab: (chunks) => <FgcTerm term="lab">{chunks}</FgcTerm>,
          })}
        </p>
      </div>
    </section>
  );
}
