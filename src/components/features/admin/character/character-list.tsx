"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Edit, Trash2, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { useActionToast } from "@/hooks/use-action-toast";
import { useDeleteDialog } from "@/hooks/use-delete-dialog";

import { deleteCharacterAction } from "./character-action";
import { AdminCharacterList } from "@/../prisma/query/admin-character.query";

interface CharacterListProps {
  characters: AdminCharacterList;
}

export function CharacterList({ characters }: CharacterListProps) {
  const router = useRouter();
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const deleteDialog = useDeleteDialog<AdminCharacterList[number]>();

  const { execute, isPending } = useActionToast(deleteCharacterAction, {
    successMessage: t("character.toast.deleted"),
    errorMessage: t("character.toast.deleteError"),
    onSuccess: () => {
      deleteDialog.close();
      router.refresh();
    },
  });

  const handleDelete = () => {
    if (deleteDialog.item) {
      execute({ id: deleteDialog.item.id });
    }
  };

  if (characters.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground mb-4">{t("character.list.empty")}</p>
        <Button asChild>
          <Link href="/admin/characters/new">
            {t("character.list.createFirst")}
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
                              {t("actions.edit")}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteDialog.openWith(character)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {tCommon("buttons.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground flex items-center gap-4 text-xs">
                      <span>
                        {t("character.list.combosCount", {
                          count: character._count.combos,
                        })}
                      </span>
                      <span>
                        {t("character.list.notesCount", {
                          count: character._count.notes,
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onOpenChange={deleteDialog.onOpenChange}
        title={t("character.deleteDialog.title")}
        description={t("character.deleteDialog.description")}
        itemName={deleteDialog.item?.name}
        isPending={isPending}
        onConfirm={handleDelete}
        confirmLabel={tCommon("buttons.delete")}
        cancelLabel={tCommon("buttons.cancel")}
        deletingLabel={t("actions.deleting")}
      />
    </>
  );
}
