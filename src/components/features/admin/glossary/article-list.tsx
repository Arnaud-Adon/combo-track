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

import { deleteArticleAction } from "./article-action";
import { StatusBadge } from "./status-badge";
import { AdminArticleList } from "@/../prisma/query/admin-glossary.query";

interface ArticleListProps {
  articles: AdminArticleList;
}

export function ArticleList({ articles }: ArticleListProps) {
  const router = useRouter();
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const deleteDialog = useDeleteDialog<AdminArticleList[number]>();

  const { execute, isPending } = useActionToast(deleteArticleAction, {
    successMessage: t("article.toast.deleted"),
    errorMessage: t("article.toast.deleteError"),
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

  if (articles.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground mb-4">{t("article.list.empty")}</p>
        <Button asChild>
          <Link href="/admin/glossary/new">
            {t("article.list.createFirst")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <CardTitle>{article.title}</CardTitle>
                    <StatusBadge published={article.published} />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {article.slug}
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
                        href={`/admin/glossary/${article.id}/edit`}
                        className="flex items-center"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {t("actions.edit")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteDialog.openWith(article)}
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
              <div className="space-y-2">
                {article.excerpt && (
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {article.excerpt}
                  </p>
                )}
                <div className="text-muted-foreground flex items-center gap-4 text-xs">
                  <span>
                    {t("article.list.category", {
                      category: article.category ?? "",
                    })}
                  </span>
                  <span>
                    {t("article.list.author", { name: article.creator.name })}
                  </span>
                  <span>
                    {t("article.list.updatedAt", {
                      date: formatDate(article.updatedAt),
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onOpenChange={deleteDialog.onOpenChange}
        title={t("article.deleteDialog.title")}
        description={t("article.deleteDialog.description")}
        itemName={deleteDialog.item?.title}
        isPending={isPending}
        onConfirm={handleDelete}
        confirmLabel={tCommon("buttons.delete")}
        cancelLabel={tCommon("buttons.cancel")}
        deletingLabel={t("actions.deleting")}
      />
    </>
  );
}
