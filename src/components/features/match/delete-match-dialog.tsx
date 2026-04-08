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

  const { execute, isPending, result } = useAction(deleteMatchAction, {
    onSuccess: () => {
      toast.success("Match supprimé avec succès");
      router.replace("/dashboard");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Erreur lors de la suppression");
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
          aria-label="Supprimer le match"
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer ce match ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Le match «&nbsp;{matchTitle}&nbsp;»
            et toutes ses notes seront définitivement supprimés.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
        {result.serverError && (
          <p className="text-destructive mt-2 text-sm">{result.serverError}</p>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
