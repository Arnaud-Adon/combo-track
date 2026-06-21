"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import z from "zod";
import { StrategyMatrixGrid } from "./strategy-matrix-grid";
import { axisSchema, cellSchema } from "./strategy-matrix-schema";

type Props = {
  title: string;
  myAxis: unknown;
  opponentAxis: unknown;
  cells: unknown;
};

export function StrategyMatrixVisualizeDialog({
  title,
  myAxis,
  opponentAxis,
  cells,
}: Props) {
  const t = useTranslations("strategyMatrix");
  const [open, setOpen] = useState(false);

  const parsed = useMemo(() => {
    const my = axisSchema.safeParse(myAxis);
    const opp = axisSchema.safeParse(opponentAxis);
    const c = z.array(cellSchema).safeParse(cells);
    if (!my.success || !opp.success || !c.success) return null;
    return { myAxis: my.data, opponentAxis: opp.data, cells: c.data };
  }, [myAxis, opponentAxis, cells]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label={t("visualize.trigger")}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>{t("visualize.trigger")}</TooltipContent>
      </Tooltip>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}
