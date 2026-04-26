import { StrategyMatrixForm } from "@/components/features/strategy-matrix/strategy-matrix-form";
import { StrategyMatrixHelpDialog } from "@/components/features/strategy-matrix/strategy-matrix-help-dialog";
import { requireAuth } from "@/lib/auth-utils";
import { notFound } from "next/navigation";
import {
  getAllCharactersGroupedByGame,
  getGameOptions,
  getStrategyMatrixById,
} from "../../../../../prisma/query/strategy-matrix.query";

export default async function StrategyMatrixDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAuth();
  const [matrix, games, charactersByGame] = await Promise.all([
    getStrategyMatrixById({ id, userId: user.id }),
    getGameOptions(),
    getAllCharactersGroupedByGame(),
  ]);

  if (!matrix) notFound();

  const matchupBadges = [
    matrix.game?.name,
    matrix.myCharacter?.name,
    matrix.opponentCharacter?.name &&
      `vs ${matrix.opponentCharacter.name}`,
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{matrix.title}</h1>
          {matchupBadges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {matchupBadges.map((label) => (
                <span
                  key={label}
                  className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs"
                >
                  {label}
                </span>
              ))}
            </div>
          )}
          {matrix.description && (
            <p className="text-muted-foreground mt-1">{matrix.description}</p>
          )}
        </div>
        <StrategyMatrixHelpDialog />
      </div>

      <StrategyMatrixForm
        mode="edit"
        matrixId={matrix.id}
        games={games}
        charactersByGame={charactersByGame}
        initialData={{
          title: matrix.title,
          description: matrix.description ?? undefined,
          gameId: matrix.gameId ?? undefined,
          myCharacterId: matrix.myCharacterId ?? undefined,
          opponentCharacterId: matrix.opponentCharacterId ?? undefined,
          myAxis: matrix.myAxis,
          opponentAxis: matrix.opponentAxis,
          cells: matrix.cells,
        }}
      />
    </div>
  );
}
