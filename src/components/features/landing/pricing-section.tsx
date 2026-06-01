"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type PricingSectionProps = {
  className?: string;
};

type Tier = {
  name: string;
  monthly: number;
  yearly: number;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  badge?: string;
};

const TIERS: Tier[] = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    description: "Tester l'outil, voir la valeur.",
    features: [
      "5 matches / mois",
      "20 combos",
      "2 matrices",
      "10 mémos",
      "1 jeu",
      "Recherche ⌘K sémantique",
    ],
    cta: "Commencer gratuitement",
  },
  {
    name: "Challenger",
    monthly: 6.99,
    yearly: 4.99,
    description: "Le joueur compétitif qui analyse régulièrement.",
    features: [
      "Matches illimités",
      "Combos illimités",
      "Matrices illimitées",
      "Mémos illimités",
      "10 rapports AI / mois",
      "Génération IA des matrices",
      "Suggestions de tags IA",
      "Tous les jeux disponibles",
    ],
    cta: "Passer Challenger",
    highlight: true,
    badge: "Le plus populaire",
  },
  {
    name: "Pro",
    monthly: 9.99,
    yearly: 7.99,
    description: "Tournois, très actifs, > 10 analyses / mois.",
    features: [
      "Tout Challenger",
      "Rapports AI illimités",
      "Export carnet de combos (PDF)",
      "Partage de matrices (liens publics)",
      "Early access nouvelles features",
      "Support prioritaire",
    ],
    cta: "Passer Pro",
  },
];

export function PricingSection(props: PricingSectionProps) {
  const { className } = props;
  const [yearly, setYearly] = useState(false);

  return (
    <section
      id="pricing"
      className={cn(
        "bg-fgc-bg text-fgc-text relative border-t",
        "border-fgc-border",
        className,
      )}
    >
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <span className="font-mono-fgc text-accent-fgc mb-4 inline-block text-[10px] tracking-[0.3em] uppercase">
            {"// Pricing"}
          </span>
          <h2 className="marketing-h1 text-fgc-text mx-auto max-w-3xl text-balance text-4xl md:text-5xl lg:text-6xl">
            Commence gratuitement.
            <br />
            <span className="text-fgc-muted">Upgrade quand tu veux.</span>
          </h2>

          <div className="border-fgc-border bg-fgc-surface mx-auto mt-10 inline-flex items-center gap-1 rounded-full border p-1">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={cn(
                "font-mono-fgc rounded-full px-4 py-1.5 text-[11px] tracking-wider uppercase transition-colors",
                !yearly
                  ? "bg-fgc-bg text-fgc-text"
                  : "text-fgc-muted hover:text-fgc-text",
              )}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={cn(
                "font-mono-fgc rounded-full px-4 py-1.5 text-[11px] tracking-wider uppercase transition-colors",
                yearly
                  ? "bg-accent-fgc text-white"
                  : "text-fgc-muted hover:text-fgc-text",
              )}
            >
              Annuel
              <span className="text-accent-fgc ml-1.5 text-[9px]">−29%</span>
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3 md:items-start">
          {TIERS.map((tier) => {
            const price = yearly ? tier.yearly : tier.monthly;
            return (
              <div
                key={tier.name}
                className={cn(
                  "relative flex flex-col rounded-xl border p-6 md:p-7",
                  tier.highlight
                    ? "border-accent-fgc bg-fgc-surface shadow-[0_30px_80px_-20px_var(--fgc-accent-soft)] md:-translate-y-3 md:scale-[1.02]"
                    : "border-fgc-border bg-fgc-surface/40",
                )}
              >
                {tier.badge && (
                  <span className="bg-accent-fgc font-mono-fgc absolute -top-2.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full px-3 py-1 text-[9px] font-bold tracking-widest text-white uppercase">
                    <Sparkles className="size-3" />
                    {tier.badge}
                  </span>
                )}

                <div className="mb-5">
                  <h3 className="font-display text-fgc-text text-xl tracking-wider uppercase">
                    {tier.name}
                  </h3>
                  <p className="text-fgc-muted mt-1 text-xs">
                    {tier.description}
                  </p>
                </div>

                <div className="mb-6 flex items-baseline gap-1.5">
                  <span className="text-fgc-text font-display text-5xl tracking-tight">
                    ${price}
                  </span>
                  <span className="text-fgc-muted font-mono-fgc text-[11px] tracking-wider">
                    /mois
                  </span>
                </div>

                <Button
                  asChild
                  className={cn(
                    "mb-6 h-11 text-sm",
                    tier.highlight
                      ? "bg-accent-fgc hover:bg-accent-fgc-strong text-white"
                      : "border-fgc-border bg-fgc-surface text-fgc-text hover:bg-fgc-bg border",
                  )}
                >
                  <Link href="/signup">{tier.cta}</Link>
                </Button>

                <ul className="space-y-2.5">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="text-fgc-text flex items-start gap-2.5 text-sm"
                    >
                      <Check
                        className={cn(
                          "mt-0.5 size-4 shrink-0",
                          tier.highlight
                            ? "text-accent-fgc"
                            : "text-fgc-muted",
                        )}
                        strokeWidth={2.5}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="border-fgc-border bg-fgc-surface/40 text-fgc-muted mx-auto mt-12 flex max-w-2xl items-center gap-3 rounded-xl border px-5 py-4 text-sm md:mt-16">
          <ShieldCheck className="text-accent-fgc size-5 shrink-0" />
          <span>
            Pas satisfait dans les{" "}
            <span className="text-fgc-text font-semibold">7 premiers jours</span>{" "}
            après ton upgrade ? On te rembourse, sans question.
          </span>
        </div>
      </div>
    </section>
  );
}
