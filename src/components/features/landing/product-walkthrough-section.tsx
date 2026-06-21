import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Fragment } from "react";

type ProductWalkthroughSectionProps = {
  className?: string;
};

export async function ProductWalkthroughSection(
  props: ProductWalkthroughSectionProps,
) {
  const { className } = props;

  const t = await getTranslations("landing");

  const steps = [
    {
      step: "01",
      eyebrow: t("walkthrough.steps.capture.eyebrow"),
      title: t("walkthrough.steps.capture.title"),
      body: t("walkthrough.steps.capture.body"),
      mock: <MatchNotebookMock />,
    },
    {
      step: "02",
      eyebrow: t("walkthrough.steps.structure.eyebrow"),
      title: t("walkthrough.steps.structure.title"),
      body: t("walkthrough.steps.structure.body"),
      mock: <StrategyMatrixMock />,
    },
    {
      step: "03",
      eyebrow: t("walkthrough.steps.synthesis.eyebrow"),
      title: t("walkthrough.steps.synthesis.title"),
      body: t("walkthrough.steps.synthesis.body"),
      mock: <AiReportMock />,
    },
  ];

  return (
    <section
      id="walkthrough"
      className={cn(
        "bg-fgc-bg text-fgc-text relative border-t",
        "border-fgc-border",
        className,
      )}
    >
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="mb-16 max-w-3xl md:mb-24">
          <span className="font-mono-fgc text-fgc-accent mb-4 inline-block text-[10px] tracking-[0.3em] uppercase">
            {t("walkthrough.eyebrow")}
          </span>
          <h2 className="marketing-h1 text-fgc-text text-4xl md:text-5xl lg:text-6xl">
            {t("walkthrough.titlePart1")}
            <br />
            <span className="text-fgc-muted">{t("walkthrough.titleHighlight")}</span>
          </h2>
        </div>

        <div className="space-y-24 md:space-y-32">
          {steps.map((step, idx) => (
            <div
              key={step.step}
              className={cn(
                "grid gap-10 md:grid-cols-2 md:gap-16 md:items-center",
                idx % 2 === 1 && "md:[&>*:first-child]:order-2",
              )}
            >
              <div className="flex flex-col">
                <div className="text-fgc-muted font-mono-fgc mb-4 flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase">
                  <span className="text-fgc-accent font-display text-3xl tracking-normal">
                    {step.step}
                  </span>
                  <span className="bg-fgc-border h-px w-12" />
                  {step.eyebrow}
                </div>
                <h3 className="text-fgc-text mb-5 text-2xl leading-tight font-semibold md:text-3xl">
                  {step.title}
                </h3>
                <p className="text-fgc-muted text-base leading-relaxed">
                  {step.body}
                </p>
              </div>

              <div className="relative">
                <div
                  className="bg-fgc-accent-soft absolute -inset-6 -z-10 rounded-3xl blur-3xl"
                  aria-hidden
                />
                {step.mock}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

async function MatchNotebookMock() {
  const t = await getTranslations("landing");
  const notes = t.raw("walkthrough.matchNotebookMock.notes") as string[];

  return (
    <div className="border-fgc-border bg-fgc-surface relative overflow-hidden rounded-xl border shadow-xl">
      <div className="border-fgc-border bg-fgc-bg/60 flex items-center justify-between border-b px-4 py-2.5">
        <span className="font-mono-fgc text-fgc-muted text-[10px] tracking-wider">
          MATCH · sf6 · luke vs jp
        </span>
        <span className="text-fgc-accent font-mono-fgc text-[10px]">REC</span>
      </div>
      <div className="bg-fgc-bg relative aspect-video">
        <div className="bg-scanlines absolute inset-0 opacity-50" />
        <div className="from-fgc-bg via-fgc-surface to-fgc-bg absolute inset-0 bg-gradient-to-tr opacity-80" />
        <div className="absolute inset-x-0 bottom-3 px-4">
          <div className="bg-fgc-border h-1 overflow-hidden rounded-full">
            <div className="bg-fgc-accent h-full w-[38%]" />
          </div>
        </div>
      </div>
      <div className="space-y-2 p-4">
        {[
          { t: "0:24", n: notes[0] },
          { t: "1:12", n: notes[1] },
          { t: "2:03", n: notes[2] },
        ].map((row) => (
          <div
            key={row.t}
            className="border-fgc-border bg-fgc-bg flex items-start gap-3 rounded-md border px-3 py-2"
          >
            <span className="text-fgc-accent font-mono-fgc shrink-0 text-[10px] tracking-wider">
              {row.t}
            </span>
            <span className="text-fgc-text text-xs">{row.n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StrategyMatrixMock() {
  const cols = ["LOW HP", "MID HP", "HIGH HP"];
  const rows = ["LOW HP", "MID HP", "HIGH HP"];
  const cells = [
    ["Tank reset", "Bait DI", "Bait DI"],
    ["Drive Rush mixup", "Frame trap", "Whiff punish"],
    ["Pressure throw", "Drive Rush mixup", "Stay safe"],
  ];

  return (
    <div className="border-fgc-border bg-fgc-surface relative overflow-hidden rounded-xl border p-5 shadow-xl">
      <div className="text-fgc-muted font-mono-fgc mb-4 flex items-center justify-between text-[10px] tracking-wider uppercase">
        <span>Luke vs JP — ressource matrix</span>
        <span className="text-fgc-accent">IA</span>
      </div>
      <div
        className="grid gap-px"
        style={{ gridTemplateColumns: "auto repeat(3, 1fr)" }}
      >
        <div />
        {cols.map((c) => (
          <div
            key={c}
            className="text-fgc-muted font-mono-fgc text-center text-[9px] tracking-wider"
          >
            {c}
          </div>
        ))}
        {rows.map((r, rIdx) => (
          <Fragment key={r}>
            <div className="text-fgc-muted font-mono-fgc flex items-center justify-end pr-2 text-[9px] tracking-wider">
              {r}
            </div>
            {cells[rIdx]?.map((cell, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                className={cn(
                  "border-fgc-border bg-fgc-bg flex aspect-square items-center justify-center border p-2 text-[10px] leading-tight",
                  rIdx === 1 && cIdx === 1 && "border-fgc-accent/50 bg-fgc-accent-soft text-fgc-accent",
                )}
              >
                {cell}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

async function AiReportMock() {
  const t = await getTranslations("landing");

  return (
    <div className="border-fgc-border bg-fgc-surface relative overflow-hidden rounded-xl border shadow-xl">
      <div className="border-fgc-border bg-fgc-bg/60 flex items-center gap-2 border-b px-4 py-2.5">
        <Sparkles className="text-fgc-accent size-3.5" />
        <span className="font-mono-fgc text-fgc-muted text-[10px] tracking-wider uppercase">
          ai match report · llama 3.3
        </span>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <div className="text-fgc-muted font-mono-fgc mb-1.5 text-[9px] tracking-[0.2em] uppercase">
            {t("walkthrough.aiReportMock.summaryLabel")}
          </div>
          <p className="text-fgc-text text-xs leading-relaxed">
            {t("walkthrough.aiReportMock.summary")}
          </p>
        </div>

        <div>
          <div className="text-fgc-muted font-mono-fgc mb-2 text-[9px] tracking-[0.2em] uppercase">
            {t("walkthrough.aiReportMock.weaknessLabel")}
          </div>
          <div className="border-fgc-accent/40 bg-fgc-accent-soft border-l-2 py-2 pl-3">
            <p className="text-fgc-text text-xs">
              {t("walkthrough.aiReportMock.weakness")}
            </p>
          </div>
        </div>

        <div>
          <div className="text-fgc-muted font-mono-fgc mb-2 text-[9px] tracking-[0.2em] uppercase">
            {t("walkthrough.aiReportMock.exercisesLabel")}
          </div>
          <ul className="space-y-1.5">
            {[
              "10min : conditioning whiff DR 5MK > delay tech",
              "5min : Burnout management drill round 3",
            ].map((e) => (
              <li
                key={e}
                className="text-fgc-text flex items-start gap-2 text-xs"
              >
                <span className="text-fgc-accent font-mono-fgc mt-0.5 text-[10px]">
                  →
                </span>
                {e}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
