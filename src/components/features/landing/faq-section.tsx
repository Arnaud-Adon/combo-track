import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

type FaqSectionProps = {
  className?: string;
};

export async function FaqSection(props: FaqSectionProps) {
  const { className } = props;

  const t = await getTranslations("landing");
  const faq = t.raw("faq.items") as { q: string; a: string }[];

  return (
    <section
      id="faq"
      className={cn(
        "bg-fgc-bg text-fgc-text relative border-t",
        "border-fgc-border",
        className,
      )}
    >
      <div className="relative mx-auto max-w-3xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="mb-12 md:mb-16">
          <span className="font-mono-fgc text-fgc-accent mb-4 inline-block text-[10px] tracking-[0.3em] uppercase">
            {t("faq.eyebrow")}
          </span>
          <h2 className="marketing-h1 text-fgc-text text-4xl md:text-5xl lg:text-6xl">
            {t("faq.titlePart1")}
            <br />
            <span className="text-fgc-muted">{t("faq.titleHighlight")}</span>
          </h2>
        </div>

        <div className="divide-fgc-border border-fgc-border divide-y border-y">
          {faq.map((item) => (
            <details
              key={item.q}
              className="group/faq peer/faq open:bg-fgc-surface/30 marker:hidden"
            >
              <summary className="text-fgc-text hover:text-fgc-accent flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-base font-medium transition-colors md:text-lg [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <Plus
                  className="text-fgc-muted mt-1 size-5 shrink-0 transition-transform group-open/faq:rotate-45"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </summary>
              <p className="text-fgc-muted pr-10 pb-6 text-sm leading-relaxed md:text-[15px]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
