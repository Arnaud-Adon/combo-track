import Link from "next/link";

import { cn } from "@/lib/utils";

type FooterProps = {
  className?: string;
};

const PRODUCT_LINKS = [
  { href: "/#benefits", label: "Bénéfices" },
  { href: "/#walkthrough", label: "Produit" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

const LAB_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/combos", label: "Combos" },
  { href: "/notes/strategy", label: "Matrices" },
  { href: "/glossary", label: "Glossaire" },
];

export function Footer(props: FooterProps) {
  const { className } = props;

  const currentYear = new Date().getFullYear();

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
              Ton labo FGC, enfin centralisé. Tes replays, tes combos et tes
              matchups au même endroit.
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
              Produit
            </span>
            {PRODUCT_LINKS.map((link) => (
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
              Ton labo
            </span>
            {LAB_LINKS.map((link) => (
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
            © {currentYear} ComboTrack
          </p>
          <p className="text-fgc-muted font-mono-fgc text-[10px] tracking-[0.2em] uppercase">
            Fait pour la FGC
          </p>
        </div>
      </div>
    </footer>
  );
}
