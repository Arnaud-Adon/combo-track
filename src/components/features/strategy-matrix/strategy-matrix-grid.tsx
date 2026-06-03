"use client";

import { cn } from "@/lib/utils";
import type { Axis, Cell } from "./strategy-matrix-schema";
import { buildCellLookup, cellKey } from "./strategy-matrix-types";

type Props = {
  myAxis: Axis;
  opponentAxis: Axis;
  cells: Cell[];
  onCellClick?: (myLevelId: string, opponentLevelId: string) => void;
  readOnly?: boolean;
};

const PREVIEW_LENGTH = 80;

function previewContent(content: string): string {
  if (!content) return "";
  if (content.length <= PREVIEW_LENGTH) return content;
  return content.slice(0, PREVIEW_LENGTH).trimEnd() + "…";
}

export function StrategyMatrixGrid({
  myAxis,
  opponentAxis,
  cells,
  onCellClick,
  readOnly = false,
}: Props) {
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
              return (
                <button
                  key={cellKey(my.id, opp.id)}
                  type="button"
                  onClick={() => !readOnly && onCellClick?.(my.id, opp.id)}
                  disabled={readOnly}
                  className={cn(
                    "bg-card text-foreground min-h-[110px] p-3 text-left text-sm leading-relaxed transition-colors",
                    !readOnly &&
                      "hover:border-primary/40 hover:bg-accent cursor-pointer border border-transparent",
                    readOnly && "cursor-default",
                    isEmpty && "text-muted-foreground/70 italic",
                  )}
                >
                  {isEmpty
                    ? readOnly
                      ? "—"
                      : "Vide · clique pour éditer"
                    : previewContent(content)}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
