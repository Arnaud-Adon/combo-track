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
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { axisSchema } from "./strategy-matrix-schema";
import type { StrategyMatrixListItem } from "../../../../prisma/query/strategy-matrix.query";
import { deleteStrategyMatrixAction } from "./strategy-matrix-action";

type Props = {
  matrices: StrategyMatrixListItem[];
};

function safeAxisLabel(value: unknown): string {
  const parsed = axisSchema.safeParse(value);
  return parsed.success ? parsed.data.label : "—";
}

export function StrategyMatrixList({ matrices }: Props) {
  const router = useRouter();
  const { execute, isPending } = useAction(deleteStrategyMatrixAction, {
    onSuccess: () => {
      toast.success("Matrice supprimée");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Erreur lors de la suppression");
    },
  });

  if (matrices.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">Aucune matrice pour le moment.</p>
        <Button asChild>
          <Link href="/notes/strategy/new">Créer ma première matrice</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {matrices.map((matrix) => {
        const matchupBadges = [
          matrix.game?.name,
          matrix.myCharacter?.name,
          matrix.opponentCharacter?.name &&
            `vs ${matrix.opponentCharacter.name}`,
        ].filter(Boolean) as string[];

        return (
        <Card key={matrix.id} className="flex flex-col gap-3 p-4">
          <div className="space-y-1">
            <h3 className="line-clamp-1 font-semibold">{matrix.title}</h3>
            {matchupBadges.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {matchupBadges.map((label) => (
                  <span
                    key={label}
                    className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
            {matrix.description && (
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {matrix.description}
              </p>
            )}
          </div>
          <div className="text-muted-foreground text-xs">
            {safeAxisLabel(matrix.myAxis)} ×{" "}
            {safeAxisLabel(matrix.opponentAxis)}
          </div>
          <div className="mt-auto flex gap-2">
            <Button asChild size="sm" className="flex-1">
              <Link href={`/notes/strategy/${matrix.id}`}>Ouvrir</Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={isPending}>
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer cette matrice ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. La matrice « {matrix.title} »
                    sera définitivement supprimée.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={() => execute({ id: matrix.id })}>
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>
        );
      })}
    </div>
  );
}
