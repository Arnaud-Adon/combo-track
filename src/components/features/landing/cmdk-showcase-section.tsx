"use client";

import { cn } from "@/lib/utils";
import {
  BookMarked,
  Command,
  CornerDownLeft,
  FileText,
  Search,
  StickyNote,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

type CmdkShowcaseSectionProps = {
  className?: string;
};

export function CmdkShowcaseSection(props: CmdkShowcaseSectionProps) {
  const { className } = props;
  const t = useTranslations("landing");
  const [queryIdx, setQueryIdx] = useState(0);
  const [chars, setChars] = useState(0);

  const queries = useMemo(() => t.raw("cmdk.queries") as string[], [t]);

  const results = [
    {
      type: "note",
      icon: FileText,
      badge: t("cmdk.results.note.badge"),
      title: t("cmdk.results.note.title"),
      sub: "sf6 · luke vs akuma · 01:42",
    },
    {
      type: "memo",
      icon: StickyNote,
      badge: t("cmdk.results.memo.badge"),
      title: t("cmdk.results.memo.title"),
      sub: "personal · pinned",
    },
    {
      type: "glossary",
      icon: BookMarked,
      badge: t("cmdk.results.glossary.badge"),
      title: t("cmdk.results.glossary.title"),
      sub: "fgc · universal",
    },
  ];

  const queryCount = queries.length;
  const currentQuery = queries[queryIdx] ?? "";

  useEffect(() => {
    if (chars < currentQuery.length) {
      const id = setTimeout(() => setChars((c) => c + 1), 65);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setChars(0);
      setQueryIdx((i) => (i + 1) % queryCount);
    }, 2400);
    return () => clearTimeout(id);
  }, [chars, currentQuery.length, queryCount]);

  return (
    <section
      id="cmdk"
      className={cn(
        "bg-fgc-bg text-fgc-text relative overflow-hidden border-t",
        "border-fgc-border",
        className,
      )}
    >
      <div
        className="absolute inset-0 -z-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, var(--fgc-accent-soft) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <span className="font-mono-fgc text-fgc-accent mb-4 inline-block text-[10px] tracking-[0.3em] uppercase">
            {t("cmdk.eyebrow")}
          </span>
          <h2 className="marketing-h1 text-fgc-text mx-auto max-w-3xl text-balance text-4xl md:text-5xl lg:text-6xl">
            {t("cmdk.titlePart1")}
            <br />
            <span className="text-fgc-accent">{t("cmdk.titleHighlight")}</span>
          </h2>
          <p className="text-fgc-muted mx-auto mt-6 max-w-xl text-base leading-relaxed md:text-lg">
            {t("cmdk.description")}
          </p>
        </div>

        <div className="border-fgc-border bg-fgc-surface relative mx-auto max-w-2xl overflow-hidden rounded-xl border shadow-2xl">
          <div className="border-fgc-border bg-fgc-bg/80 flex items-center gap-3 border-b px-4 py-3.5">
            <Search className="text-fgc-muted size-4 shrink-0" />
            <div className="text-fgc-text fgc-cursor flex-1 text-sm">
              {currentQuery.slice(0, chars)}
            </div>
            <kbd className="border-fgc-border bg-fgc-surface text-fgc-muted font-mono-fgc rounded border px-1.5 py-0.5 text-[10px]">
              esc
            </kbd>
          </div>

          <div className="divide-fgc-border max-h-[320px] divide-y overflow-hidden">
            {results.map((result, idx) => {
              const Icon = result.icon;
              return (
                <div
                  key={result.title}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 transition-colors",
                    idx === 0
                      ? "bg-fgc-accent-soft border-fgc-accent/30 border-l-2"
                      : "hover:bg-fgc-bg/60",
                  )}
                >
                  <span
                    className={cn(
                      "border-fgc-border bg-fgc-bg flex size-8 shrink-0 items-center justify-center rounded-sm border",
                      idx === 0 && "border-fgc-accent/40 bg-fgc-accent-soft",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-3.5",
                        idx === 0 ? "text-fgc-accent" : "text-fgc-muted",
                      )}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-mono-fgc text-[9px] tracking-widest uppercase",
                          idx === 0 ? "text-fgc-accent" : "text-fgc-muted",
                        )}
                      >
                        {result.badge}
                      </span>
                    </div>
                    <div className="text-fgc-text mt-0.5 truncate text-sm">
                      {result.title}
                    </div>
                    <div className="text-fgc-muted truncate text-[11px]">
                      {result.sub}
                    </div>
                  </div>
                  {idx === 0 && (
                    <CornerDownLeft className="text-fgc-accent size-3.5 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-fgc-border bg-fgc-bg/60 text-fgc-muted font-mono-fgc flex items-center justify-between border-t px-4 py-2 text-[10px] tracking-wider">
            <span>SEMANTIC · pgvector + openai</span>
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="border-fgc-border rounded border px-1">↑↓</kbd>
                {t("cmdk.navigate")}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="border-fgc-border rounded border px-1">↵</kbd>
                {t("cmdk.open")}
              </span>
            </span>
          </div>
        </div>

        <div className="text-fgc-muted mt-8 flex items-center justify-center gap-2 text-xs">
          <span>{t("cmdk.availableEverywhere")}</span>
          <kbd className="border-fgc-border bg-fgc-surface font-mono-fgc inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px]">
            <Command className="size-3" />K
          </kbd>
        </div>
      </div>
    </section>
  );
}
