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

import { deleteArticleAction } from "./article-action";
import { StatusBadge } from "./status-badge";
import { AdminArticleList } from "@/../prisma/query/admin-glossary.query";

interface ArticleListProps {
  articles: AdminArticleList;
}

export function ArticleList({ articles }: ArticleListProps) {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    article: AdminArticleList[number] | null;
  }>({
    open: false,
    article: null,
  });

  const { execute, isPending } = useAction(deleteArticleAction, {
    onSuccess: () => {
      toast.success("Article supprimé avec succès");
      setDeleteDialog({ open: false, article: null });
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Erreur lors de la suppression");
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
        <p className="text-muted-foreground mb-4">
          Aucun article pour le moment
        </p>
        <Button asChild>
          <Link href="/admin/glossary/new">Créer votre premier article</Link>
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
                        Éditer
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openDeleteDialog(article)}
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
              <div className="space-y-2">
                {article.excerpt && (
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {article.excerpt}
                  </p>
                )}
                <div className="text-muted-foreground flex items-center gap-4 text-xs">
                  <span>Catégorie: {article.category}</span>
                  <span>Par {article.creator.name}</span>
                  <span>
                    Modifié le{" "}
                    {new Date(article.updatedAt).toLocaleDateString()}
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
            <AlertDialogTitle>Supprimer cet article ?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog.article?.title}
              <br />
              <br />
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
