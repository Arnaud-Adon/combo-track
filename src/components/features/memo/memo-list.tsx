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
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { MemoListItem } from "../../../../prisma/query/memo.query";
import { deleteMemoAction } from "./memo-action";
import { MemoVisualizeDialog } from "./memo-visualize-dialog";

type Props = {
  memos: MemoListItem[];
};

export function MemoList({ memos }: Props) {
  const router = useRouter();
  const { execute, isPending } = useAction(deleteMemoAction, {
    onSuccess: () => {
      toast.success("Mémo supprimé");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Erreur lors de la suppression");
    },
  });

  if (memos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">Aucun mémo pour le moment.</p>
        <Button asChild>
          <Link href="/notes/memo/new">Créer mon premier mémo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {memos.map((memo) => (
        <Card key={memo.id} className="flex flex-col gap-3 p-4">
          <div className="space-y-1">
            <h3 className="line-clamp-1 font-semibold">{memo.title}</h3>
            {memo.content && (
              <p className="text-muted-foreground line-clamp-3 text-sm whitespace-pre-wrap">
                {memo.content}
              </p>
            )}
          </div>
          <div className="text-muted-foreground text-xs">
            Mis à jour le{" "}
            {new Date(memo.updatedAt).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
          <div className="mt-auto flex justify-end gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild size="icon" variant="outline">
                  <Link href={`/notes/memo/${memo.id}`} aria-label="Ouvrir">
                    <FolderOpen className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ouvrir</TooltipContent>
            </Tooltip>
            <MemoVisualizeDialog title={memo.title} content={memo.content} />
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={isPending}
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Supprimer</TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer ce mémo ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Le mémo « {memo.title} » sera
                    définitivement supprimé.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={() => execute({ id: memo.id })}>
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>
      ))}
    </div>
  );
}
