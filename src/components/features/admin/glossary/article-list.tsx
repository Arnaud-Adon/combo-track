"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { useTranslations } from "next-intl";
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
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    article: AdminArticleList[number] | null;
  }>({
    open: false,
    article: null,
  });

  const { execute, isPending } = useAction(deleteArticleAction, {
    onSuccess: () => {
      toast.success(t("article.toast.deleted"));
      setDeleteDialog({ open: false, article: null });
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? t("article.toast.deleteError"));
    },
  });

  const openDeleteDialog = (article: AdminArticleList[number]) => {
    setDeleteDialog({ open: true, article });
  };

  const handleDelete = () => {
    if (deleteDialog.article) {
      execute({ id: deleteDialog.article.id });
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
                      onClick={() => openDeleteDialog(article)}
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
                      date: new Date(article.updatedAt).toLocaleDateString(),
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteDialog({ open: false, article: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("article.deleteDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog.article?.title}
              <br />
              <br />
              {t("article.deleteDialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              {tCommon("buttons.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? t("actions.deleting") : tCommon("buttons.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
