"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo } from "react";
import z from "zod";
import { StrategyMatrixGrid } from "./strategy-matrix-grid";
import { axisSchema, cellSchema } from "./strategy-matrix-schema";

type VisualizeMatrix = {
  id: string;
  title: string;
  myAxis: unknown;
  opponentAxis: unknown;
  cells: unknown;
};

type Props = {
  matrices: VisualizeMatrix[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
};

export function StrategyMatrixVisualizeDialog({
  matrices,
  index,
  onIndexChange,
}: Props) {
  const t = useTranslations("strategyMatrix");
  const matrix = index != null ? matrices[index] : null;
  const hasMultiple = matrices.length > 1;

  const parsed = useMemo(() => {
    if (!matrix) return null;
    const my = axisSchema.safeParse(matrix.myAxis);
    const opp = axisSchema.safeParse(matrix.opponentAxis);
    const c = z.array(cellSchema).safeParse(matrix.cells);
    if (!my.success || !opp.success || !c.success) return null;
    return { myAxis: my.data, opponentAxis: opp.data, cells: c.data };
  }, [matrix]);

  const goPrev = useCallback(() => {
    onIndexChange(
      index == null ? null : (index - 1 + matrices.length) % matrices.length,
    );
  }, [index, matrices.length, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange(index == null ? null : (index + 1) % matrices.length);
  }, [index, matrices.length, onIndexChange]);

  useEffect(() => {
    if (index == null || !hasMultiple) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, hasMultiple, goPrev, goNext]);

  return (
    <Dialog
      open={index != null}
      onOpenChange={(isOpen) => !isOpen && onIndexChange(null)}
    >
      <DialogContent className="max-h-[90vh] sm:max-w-[85vw]">
        {matrix && (
          <>
            <DialogHeader>
              <DialogTitle>{matrix.title}</DialogTitle>
            </DialogHeader>
            <div className="max-h-[75vh] overflow-auto px-1">
              {parsed ? (
                <StrategyMatrixGrid
                  myAxis={parsed.myAxis}
                  opponentAxis={parsed.opponentAxis}
                  cells={parsed.cells}
                  readOnly
                />
              ) : (
                <p className="text-muted-foreground text-sm">
                  {t("visualize.error")}
                </p>
              )}
            </div>
            {hasMultiple && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={t("visualize.previous")}
                  onClick={goPrev}
                  className="absolute top-1/2 -left-16 z-10 size-11 -translate-y-1/2 rounded-full shadow-md"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={t("visualize.next")}
                  onClick={goNext}
                  className="absolute top-1/2 -right-16 z-10 size-11 -translate-y-1/2 rounded-full shadow-md"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
