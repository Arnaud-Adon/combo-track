"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Copy, Edit, ExternalLink, Gauge, Heart, Trash2, Zap } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComboDetail as ComboDetailType } from "@/../prisma/query/combo.query";

import { deleteComboAction } from "./combo-action";

interface ComboDetailProps {
  combo: ComboDetailType;
}

export function ComboDetail({ combo }: ComboDetailProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { execute, isPending } = useAction(deleteComboAction, {
    onSuccess: () => {
      toast.success("Combo supprimé");
      router.push("/combos");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Erreur lors de la suppression");
    },
  });

  const handleCopyNotation = async () => {
    try {
      await navigator.clipboard.writeText(combo.notation);
      toast.success("Notation copiée");
    } catch {
      toast.error("Impossible de copier");
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{combo.title}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{combo.character.game.name}</Badge>
              <Badge variant="secondary">{combo.character.name}</Badge>
              {combo.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleCopyNotation}>
              <Copy className="mr-2 h-4 w-4" />
              Copier
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/combos/${combo.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Éditer
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(true)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notation</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="bg-muted block rounded-md p-4 font-mono text-base break-words">
              {combo.notation}
            </code>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-6">
              <Heart className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-muted-foreground text-xs">Dégâts</p>
                <p className="text-lg font-semibold">{combo.damage ?? "—"}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-6">
              <Zap className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-muted-foreground text-xs">Jauge</p>
                <p className="text-lg font-semibold">
                  {combo.meterUsed ?? "—"}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-6">
              <Gauge className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-muted-foreground text-xs">Difficulté</p>
                <p className="text-lg font-semibold">
                  {combo.difficulty ? `${combo.difficulty}/5` : "—"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {combo.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{combo.notes}</p>
            </CardContent>
          </Card>
        )}

        {combo.sourceNote && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Note source</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground text-sm">
                Extrait depuis : {combo.sourceNote.match.title}
              </p>
              <p className="text-sm">{combo.sourceNote.content}</p>
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/videos/${combo.sourceNote.match.id}?t=${combo.sourceNote.timestamp}`}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Voir la note dans le replay
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce combo ?</AlertDialogTitle>
            <AlertDialogDescription>
              {combo.title}
              <br />
              <br />
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => execute({ id: combo.id })}
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
