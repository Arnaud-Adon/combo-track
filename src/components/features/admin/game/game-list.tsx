"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Edit, Trash2, MoreVertical } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { deleteGameAction } from "./game-action";
import { AdminGameList } from "@/../prisma/query/admin-game.query";

interface GameListProps {
  games: AdminGameList;
}

export function GameList({ games }: GameListProps) {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    game: AdminGameList[number] | null;
  }>({
    open: false,
    game: null,
  });

  const { execute, isPending } = useAction(deleteGameAction, {
    onSuccess: () => {
      toast.success("Jeu supprimé avec succès");
      setDeleteDialog({ open: false, game: null });
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Erreur lors de la suppression");
    },
  });

  const openDeleteDialog = (game: AdminGameList[number]) => {
    setDeleteDialog({ open: true, game });
  };

  const handleDelete = () => {
    if (deleteDialog.game) {
      execute({ id: deleteDialog.game.id });
    }
  };

  if (games.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground mb-4">Aucun jeu pour le moment</p>
        <Button asChild>
          <Link href="/admin/games/new">Créer votre premier jeu</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {games.map((game) => (
          <Card key={game.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{game.name}</CardTitle>
                  <p className="text-muted-foreground text-sm">{game.slug}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/admin/games/${game.id}/edit`}
                        className="flex items-center"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Éditer
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openDeleteDialog(game)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground flex items-center gap-4 text-xs">
                <span>{game._count.characters} personnages</span>
                <span>{game._count.combos} combos</span>
                <span>
                  Modifié le {new Date(game.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteDialog({ open: false, game: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce jeu ?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog.game?.name}
              <br />
              <br />
              Cela supprimera aussi tous les personnages et combos associés.
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
