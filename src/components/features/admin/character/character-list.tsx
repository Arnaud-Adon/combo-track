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

import { deleteCharacterAction } from "./character-action";
import { AdminCharacterList } from "@/../prisma/query/admin-character.query";

interface CharacterListProps {
  characters: AdminCharacterList;
}

export function CharacterList({ characters }: CharacterListProps) {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    character: AdminCharacterList[number] | null;
  }>({
    open: false,
    character: null,
  });

  const { execute, isPending } = useAction(deleteCharacterAction, {
    onSuccess: () => {
      toast.success("Personnage supprimé avec succès");
      setDeleteDialog({ open: false, character: null });
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Erreur lors de la suppression");
    },
  });

  const openDeleteDialog = (character: AdminCharacterList[number]) => {
    setDeleteDialog({ open: true, character });
  };

  const handleDelete = () => {
    if (deleteDialog.character) {
      execute({ id: deleteDialog.character.id });
    }
  };

  if (characters.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground mb-4">
          Aucun personnage pour le moment
        </p>
        <Button asChild>
          <Link href="/admin/characters/new">
            Créer votre premier personnage
          </Link>
        </Button>
      </div>
    );
  }

  const grouped = characters.reduce<
    Record<string, { gameName: string; items: AdminCharacterList }>
  >((acc, character) => {
    const key = character.game.id;
    if (!acc[key]) {
      acc[key] = { gameName: character.game.name, items: [] };
    }
    acc[key].items.push(character);
    return acc;
  }, {});

  return (
    <>
      <div className="space-y-8">
        {Object.entries(grouped).map(([gameId, group]) => (
          <section key={gameId} className="space-y-4">
            <h2 className="text-xl font-semibold">{group.gameName}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((character) => (
                <Card key={character.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle>{character.name}</CardTitle>
                        <p className="text-muted-foreground text-sm">
                          {character.slug}
                        </p>
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
                              href={`/admin/characters/${character.id}/edit`}
                              className="flex items-center"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Éditer
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(character)}
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
                      <span>{character._count.combos} combos</span>
                      <span>{character._count.notes} notes</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteDialog({ open: false, character: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce personnage ?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog.character?.name}
              <br />
              <br />
              Cela supprimera aussi tous les combos associés. Les notes liées
              seront détachées. Cette action est irréversible.
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
