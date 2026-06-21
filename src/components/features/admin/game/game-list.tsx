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
import { formatDate } from "@/utils";

import { deleteGameAction } from "./game-action";
import { AdminGameList } from "@/../prisma/query/admin-game.query";

interface GameListProps {
  games: AdminGameList;
}

export function GameList({ games }: GameListProps) {
  const router = useRouter();
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const deleteDialog = useDeleteDialog<AdminGameList[number]>();

  const { execute, isPending } = useActionToast(deleteGameAction, {
    successMessage: t("game.toast.deleted"),
    errorMessage: t("game.toast.deleteError"),
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

  if (games.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground mb-4">{t("game.list.empty")}</p>
        <Button asChild>
          <Link href="/admin/games/new">{t("game.list.createFirst")}</Link>
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
                        {t("actions.edit")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteDialog.openWith(game)}
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
                  {t("game.list.charactersCount", {
                    count: game._count.characters,
                  })}
                </span>
                <span>
                  {t("game.list.combosCount", { count: game._count.combos })}
                </span>
                <span>
                  {t("game.list.updatedAt", {
                    date: formatDate(game.updatedAt),
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onOpenChange={deleteDialog.onOpenChange}
        title={t("game.deleteDialog.title")}
        description={t("game.deleteDialog.description")}
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
