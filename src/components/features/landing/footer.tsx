import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { cn } from "@/lib/utils";

type FooterProps = {
  className?: string;
};

export async function Footer(props: FooterProps) {
  const { className } = props;

  const t = await getTranslations("landing");
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { href: "/#benefits", label: t("nav.benefits") },
    { href: "/#walkthrough", label: t("nav.product") },
    { href: "/#pricing", label: t("nav.pricing") },
    { href: "/#faq", label: t("nav.faq") },
  ];

  const labLinks = [
    { href: "/dashboard", label: t("footer.lab.dashboard") },
    { href: "/combos", label: t("footer.lab.combos") },
    { href: "/notes/strategy", label: t("footer.lab.matrices") },
    { href: "/glossary", label: t("footer.lab.glossary") },
  ];

  return (
    <footer
      className={cn(
        "border-fgc-border bg-fgc-bg text-fgc-text relative border-t",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--fgc-border) 30%, var(--fgc-border) 70%, transparent)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col">
            <Link href="/" className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="border-fgc-accent/40 bg-fgc-accent/10 text-fgc-accent font-mono-fgc relative flex size-7 items-center justify-center rounded-sm border text-[11px] font-bold"
              >
                CT
              </span>
              <span className="font-display text-fgc-text text-base tracking-wider uppercase">
                ComboTrack
              </span>
            </Link>

            <p className="text-fgc-muted mt-4 max-w-xs text-sm leading-relaxed">
              {t("footer.tagline")}
            </p>

            <div className="border-fgc-border bg-fgc-surface/70 text-fgc-muted mt-5 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1">
              <span className="bg-fgc-accent size-1.5 rounded-full" />
              <span className="font-mono-fgc text-[10px] tracking-[0.2em] uppercase">
                SF6 · Tekken 8 · GG Strive
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-mono-fgc text-fgc-muted text-[10px] tracking-[0.2em] uppercase">
              {t("footer.productHeading")}
            </span>
            {productLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-fgc-muted hover:text-fgc-text w-fit text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-mono-fgc text-fgc-muted text-[10px] tracking-[0.2em] uppercase">
              {t("footer.labHeading")}
            </span>
            {labLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-fgc-muted hover:text-fgc-text w-fit text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-fgc-border mt-12 flex flex-col items-center justify-between gap-2 border-t pt-6 sm:flex-row">
          <p className="text-fgc-muted font-mono-fgc text-xs">
            {t("footer.copyright", { year: currentYear })}
          </p>
          <p className="text-fgc-muted font-mono-fgc text-[10px] tracking-[0.2em] uppercase">
            {t("footer.madeForFgc")}
          </p>
        </div>
      </div>
    </footer>
  );
}
