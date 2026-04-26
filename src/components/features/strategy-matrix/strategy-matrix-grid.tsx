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
        className="bg-border grid min-w-fit gap-px rounded-lg border"
        style={{
          gridTemplateColumns: `minmax(140px, 200px) repeat(${columnCount}, minmax(160px, 1fr))`,
        }}
      >
        <div className="bg-muted text-muted-foreground flex items-center justify-center p-3 text-xs font-semibold">
          {opponentAxis.label} ↓ / {myAxis.label} →
        </div>

        {myAxis.levels.map((my) => (
          <div
            key={my.id}
            className="bg-muted text-foreground flex items-center justify-center p-3 text-center text-sm font-semibold"
          >
            {my.label}
          </div>
        ))}

        {opponentAxis.levels.map((opp) => (
          <div key={opp.id} className="contents">
            <div className="bg-muted text-foreground flex items-center justify-center p-3 text-center text-sm font-semibold">
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
                    "bg-card text-foreground min-h-[100px] p-3 text-left text-sm transition-colors",
                    !readOnly && "hover:bg-accent cursor-pointer",
                    readOnly && "cursor-default",
                    isEmpty && "text-muted-foreground italic",
                  )}
                >
                  {isEmpty
                    ? "Vide — cliquez pour éditer"
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
