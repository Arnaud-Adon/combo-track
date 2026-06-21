"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
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

export function PricingSection(props: PricingSectionProps) {
  const { className } = props;
  const t = useTranslations("landing");
  const [yearly, setYearly] = useState(false);

  const tiers: Tier[] = [
    {
      name: "Free",
      monthly: 0,
      yearly: 0,
      description: t("pricing.tiers.free.description"),
      features: t.raw("pricing.tiers.free.features") as string[],
      cta: t("pricing.tiers.free.cta"),
    },
    {
      name: "Challenger",
      monthly: 6.99,
      yearly: 4.99,
      description: t("pricing.tiers.challenger.description"),
      features: t.raw("pricing.tiers.challenger.features") as string[],
      cta: t("pricing.tiers.challenger.cta"),
      highlight: true,
      badge: t("pricing.popularBadge"),
    },
    {
      name: "Pro",
      monthly: 9.99,
      yearly: 7.99,
      description: t("pricing.tiers.pro.description"),
      features: t.raw("pricing.tiers.pro.features") as string[],
      cta: t("pricing.tiers.pro.cta"),
    },
  ];

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
          <span className="font-mono-fgc text-fgc-accent mb-4 inline-block text-[10px] tracking-[0.3em] uppercase">
            {t("pricing.eyebrow")}
          </span>
          <h2 className="marketing-h1 text-fgc-text mx-auto max-w-3xl text-balance text-4xl md:text-5xl lg:text-6xl">
            {t("pricing.titlePart1")}
            <br />
            <span className="text-fgc-muted">{t("pricing.titleHighlight")}</span>
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
              {t("pricing.billingMonthly")}
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={cn(
                "font-mono-fgc rounded-full px-4 py-1.5 text-[11px] tracking-wider uppercase transition-colors",
                yearly
                  ? "bg-fgc-accent text-white"
                  : "text-fgc-muted hover:text-fgc-text",
              )}
            >
              {t("pricing.billingYearly")}
              <span className="text-fgc-accent ml-1.5 text-[9px]">−29%</span>
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3 md:items-start">
          {tiers.map((tier) => {
            const price = yearly ? tier.yearly : tier.monthly;
            return (
              <div
                key={tier.name}
                className={cn(
                  "relative flex flex-col rounded-xl border p-6 md:p-7",
                  tier.highlight
                    ? "border-fgc-accent bg-fgc-surface shadow-[0_30px_80px_-20px_var(--fgc-accent-soft)] md:-translate-y-3 md:scale-[1.02]"
                    : "border-fgc-border bg-fgc-surface/40",
                )}
              >
                {tier.badge && (
                  <span className="bg-fgc-accent font-mono-fgc absolute -top-2.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full px-3 py-1 text-[9px] font-bold tracking-widest text-white uppercase">
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
                    {t("pricing.perMonth")}
                  </span>
                </div>

                <Button
                  asChild
                  className={cn(
                    "mb-6 h-11 text-sm",
                    tier.highlight
                      ? "bg-fgc-accent hover:bg-fgc-accent-strong text-white"
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
                            ? "text-fgc-accent"
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
          <ShieldCheck className="text-fgc-accent size-5 shrink-0" />
          <span>
            {t.rich("pricing.guarantee", {
              b: (chunks) => (
                <span className="text-fgc-text font-semibold">{chunks}</span>
              ),
            })}
          </span>
        </div>
      </div>
    </section>
  );
}
