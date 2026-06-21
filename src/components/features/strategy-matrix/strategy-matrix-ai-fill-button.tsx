"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { fillStrategyMatrixWithAiAction } from "./strategy-matrix-ai-action";
import type { Axis, Cell } from "./strategy-matrix-schema";

type Props = {
  title: string;
  description?: string;
  gameId?: string;
  myCharacterId?: string;
  opponentCharacterId?: string;
  myAxis: Axis;
  opponentAxis: Axis;
  cells: Cell[];
  onCellsGenerated: (cells: Cell[]) => void;
};

export function StrategyMatrixAiFillButton({
  title,
  description,
  gameId,
  myCharacterId,
  opponentCharacterId,
  myAxis,
  opponentAxis,
  cells,
  onCellsGenerated,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const t = useTranslations("strategyMatrix");
  const tc = useTranslations("common");

  const { execute, isPending } = useAction(fillStrategyMatrixWithAiAction, {
    onSuccess: ({ data }) => {
      if (!data?.cells || data.cells.length === 0) {
        toast.error(t("aiFill.empty"));
        return;
      }
      onCellsGenerated(data.cells);
      toast.success(t("aiFill.success", { count: data.cells.length }));
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? t("aiFill.error"));
    },
  });

  const hasContent = cells.some((c) => c.content.trim().length > 0);
  const hasTitle = title.trim().length > 0;

  const triggerFill = () => {
    execute({
      title,
      description,
      gameId,
      myCharacterId,
      opponentCharacterId,
      myAxis,
      opponentAxis,
    });
  };

  const handleClick = () => {
    if (hasContent) {
      setConfirmOpen(true);
      return;
    }
    triggerFill();
  };

  return (
    <>
      <Button
        type="button"
        size="sm"
        onClick={handleClick}
        disabled={isPending || !hasTitle}
      >
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        {isPending ? t("aiFill.generating") : t("aiFill.button")}
      </Button>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("aiFill.overwriteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("aiFill.overwriteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tc("buttons.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false);
                triggerFill();
              }}
            >
              {t("aiFill.continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
