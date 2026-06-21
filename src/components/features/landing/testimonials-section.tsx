import { cn } from "@/lib/utils";
import { Quote, Shield } from "lucide-react";
import { getTranslations } from "next-intl/server";

type TestimonialsSectionProps = {
  className?: string;
};

export async function TestimonialsSection(props: TestimonialsSectionProps) {
  const { className } = props;

  const t = await getTranslations("landing");

  const quotes = [
    {
      quote: t("testimonials.items.theo.quote"),
      name: t("testimonials.items.theo.name"),
      main: "Kazuya",
      game: "Tekken 8",
      rank: "Kishin",
    },
    {
      quote: t("testimonials.items.sarah.quote"),
      name: t("testimonials.items.sarah.name"),
      main: "Cammy",
      game: "SF6",
      rank: "Master",
    },
    {
      quote: t("testimonials.items.marc.quote"),
      name: t("testimonials.items.marc.name"),
      main: "Ramlethal",
      game: "GG Strive",
      rank: "Top 8 local",
    },
  ];

  const trust = t.raw("testimonials.trust") as string[];

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
            {t("testimonials.eyebrow")}
          </span>
          <h2 className="marketing-h1 text-fgc-text text-4xl md:text-5xl lg:text-6xl">
            {t("testimonials.titlePart1")}
            <br />
            <span className="text-fgc-muted">{t("testimonials.titleHighlight")}</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-5">
          {quotes.map((q) => (
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
          {trust.map((item) => (
            <div
              key={item}
              className="text-fgc-muted flex items-start gap-3 py-5 text-sm md:py-6"
            >
              <Shield className="text-fgc-accent mt-0.5 size-4 shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
