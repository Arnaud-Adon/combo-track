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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FolderOpen, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionToast } from "@/hooks/use-action-toast";
import { StrategyMatrixVisualizeDialog } from "./strategy-matrix-visualize-dialog";
import { axisSchema } from "./strategy-matrix-schema";
import type { StrategyMatrixListItem } from "../../../../prisma/query/strategy-matrix.query";
import { deleteStrategyMatrixAction } from "./strategy-matrix-action";

type Props = {
  matrices: StrategyMatrixListItem[];
};

function safeAxisLabel(value: unknown): string {
  const parsed = axisSchema.safeParse(value);
  return parsed.success ? parsed.data.label : "—";
}

export function StrategyMatrixList({ matrices }: Props) {
  const router = useRouter();
  const t = useTranslations("strategyMatrix");
  const tc = useTranslations("common");
  const { execute, isPending } = useActionToast(deleteStrategyMatrixAction, {
    successMessage: t("list.toast.deleted"),
    errorMessage: t("list.toast.deleteError"),
    onSuccess: () => {
      router.refresh();
    },
  });

  if (matrices.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">{t("list.empty")}</p>
        <Button asChild>
          <Link href="/notes/strategy/new">{t("list.createFirst")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {matrices.map((matrix) => {
        const matchupBadges = [
          matrix.game?.name,
          matrix.myCharacter?.name,
          matrix.opponentCharacter?.name &&
            `vs ${matrix.opponentCharacter.name}`,
        ].filter(Boolean) as string[];

        return (
          <Card key={matrix.id} className="flex flex-col gap-3 p-4">
            <div className="space-y-1">
              <h3 className="line-clamp-1 font-semibold">{matrix.title}</h3>
              {matchupBadges.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {matchupBadges.map((label) => (
                    <span
                      key={label}
                      className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px]"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
              {matrix.description && (
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {matrix.description}
                </p>
              )}
            </div>
            <div className="text-muted-foreground text-xs">
              {safeAxisLabel(matrix.myAxis)} ×{" "}
              {safeAxisLabel(matrix.opponentAxis)}
            </div>
            <div className="mt-auto flex justify-end gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild size="icon" variant="outline">
                    <Link
                      href={`/notes/strategy/${matrix.id}`}
                      aria-label={t("list.open")}
                    >
                      <FolderOpen className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("list.open")}</TooltipContent>
              </Tooltip>
              <StrategyMatrixVisualizeDialog
                title={matrix.title}
                myAxis={matrix.myAxis}
                opponentAxis={matrix.opponentAxis}
                cells={matrix.cells}
              />
              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={isPending}
                        aria-label={tc("buttons.delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>{tc("buttons.delete")}</TooltipContent>
                </Tooltip>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("list.deleteTitle")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("list.deleteDescription", { title: matrix.title })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{tc("buttons.cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => execute({ id: matrix.id })}
                    >
                      {tc("buttons.delete")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
