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
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { deleteMatchAction } from "./match-action";

interface DeleteMatchDialogProps {
  matchId: string;
  matchTitle: string;
}

export function DeleteMatchDialog({
  matchId,
  matchTitle,
}: DeleteMatchDialogProps) {
  const router = useRouter();
  const t = useTranslations("match");
  const tCommon = useTranslations("common");

  const { execute, isPending, result } = useAction(deleteMatchAction, {
    onSuccess: () => {
      toast.success(t("toast.deleted"));
      router.replace("/dashboard");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? t("toast.deleteError"));
    },
  });

  const handleDelete = () => {
    execute({ matchId });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("deleteDialog.trigger")}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteDialog.description", { title: matchTitle })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {tCommon("buttons.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? t("deleteDialog.deleting") : tCommon("buttons.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
        {result.serverError && (
          <p className="text-destructive mt-2 text-sm">{result.serverError}</p>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
