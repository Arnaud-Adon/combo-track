"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const ITEMS = [
  { sample: "(+N)", key: "advantage", cls: "text-frame-positive" },
  { sample: "(-N)", key: "disadvantage", cls: "text-frame-negative" },
  { sample: "(0)", key: "neutral", cls: "text-frame-neutral" },
] as const;

type FrameLegendProps = {
  className?: string;
};

export function FrameLegend(props: FrameLegendProps) {
  const { className } = props;
  const t = useTranslations("strategyMatrix");

  return (
    <div
      className={cn("flex flex-wrap items-center gap-x-4 gap-y-1", className)}
    >
      <span className="text-muted-foreground font-mono text-[10px] tracking-[0.2em] uppercase">
        {t("frameLegend.heading")}
      </span>
      {ITEMS.map((item) => (
        <span key={item.key} className="flex items-center gap-1.5 text-xs">
          <code className={cn("font-mono font-semibold", item.cls)}>
            {item.sample}
          </code>
          <span className="text-muted-foreground">
            {t(`frameLegend.${item.key}`)}
          </span>
        </span>
      ))}
    </div>
  );
}
