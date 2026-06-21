"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notationComponents } from "@/components/features/notation/notation-renderer";
import type { Axis, Cell } from "./strategy-matrix-schema";
import { buildCellLookup, cellKey } from "./strategy-matrix-types";

type Props = {
  myAxis: Axis;
  opponentAxis: Axis;
  cells: Cell[];
  onCellClick?: (myLevelId: string, opponentLevelId: string) => void;
  readOnly?: boolean;
};

export function StrategyMatrixGrid({
  myAxis,
  opponentAxis,
  cells,
  onCellClick,
  readOnly = false,
}: Props) {
  const t = useTranslations("strategyMatrix");
  const lookup = buildCellLookup(cells);
  const columnCount = myAxis.levels.length;

  return (
    <div className="overflow-x-auto">
      <div
        className="bg-border grid min-w-fit gap-px overflow-hidden rounded-xl border"
        style={{
          gridTemplateColumns: `minmax(140px, 200px) repeat(${columnCount}, minmax(160px, 1fr))`,
        }}
      >
        <div className="bg-secondary flex flex-col justify-center gap-0.5 p-3 font-mono text-[10px] uppercase">
          <span className="text-muted-foreground">↓ {opponentAxis.label}</span>
          <span className="text-primary">{myAxis.label} →</span>
        </div>

        {myAxis.levels.map((my) => (
          <div
            key={my.id}
            className="bg-accent text-primary flex items-center justify-center p-3 text-center font-mono text-xs font-semibold uppercase"
          >
            {my.label}
          </div>
        ))}

        {opponentAxis.levels.map((opp) => (
          <div key={opp.id} className="contents">
            <div className="bg-secondary text-foreground flex items-center justify-center p-3 text-center font-mono text-xs font-semibold">
              {opp.label}
            </div>
            {myAxis.levels.map((my) => {
              const cell = lookup.get(cellKey(my.id, opp.id));
              const content = cell?.content ?? "";
              const isEmpty = !content;
              const interactive = !readOnly;
              return (
                <div
                  key={cellKey(my.id, opp.id)}
                  role={interactive ? "button" : undefined}
                  tabIndex={interactive ? 0 : undefined}
                  onClick={() => interactive && onCellClick?.(my.id, opp.id)}
                  onKeyDown={(event) => {
                    if (!interactive) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onCellClick?.(my.id, opp.id);
                    }
                  }}
                  className={cn(
                    "bg-card text-foreground min-h-[110px] p-3 text-left text-sm leading-relaxed transition-colors",
                    interactive &&
                      "hover:border-primary/40 hover:bg-accent focus-visible:border-primary/40 focus-visible:ring-ring/50 cursor-pointer border border-transparent focus-visible:ring-2 focus-visible:outline-none",
                    !interactive && "cursor-default",
                    isEmpty && "text-muted-foreground/70 italic",
                  )}
                >
                  {isEmpty ? (
                    readOnly ? (
                      "—"
                    ) : (
                      t("grid.emptyCell")
                    )
                  ) : (
                    <div className="prose prose-invert prose-sm line-clamp-5 max-w-none [&_*]:my-0 [&_li]:leading-snug [&_p]:leading-snug">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={notationComponents}
                      >
                        {content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
