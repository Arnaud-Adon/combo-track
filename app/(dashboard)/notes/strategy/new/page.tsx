import { StrategyMatrixForm } from "@/components/features/strategy-matrix/strategy-matrix-form";
import { StrategyMatrixHelpDialog } from "@/components/features/strategy-matrix/strategy-matrix-help-dialog";
import { requireAuth } from "@/lib/auth-utils";
import {
  getAllCharactersGroupedByGame,
  getGameOptions,
} from "../../../../../prisma/query/strategy-matrix.query";

export default async function NewStrategyMatrixPage() {
  await requireAuth();
  const [games, charactersByGame] = await Promise.all([
    getGameOptions(),
    getAllCharactersGroupedByGame(),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Nouvelle matrice de stratégie</h1>
          <p className="text-muted-foreground mt-1">
            Définissez vos axes (mes ressources × ressources adverses) et
            remplissez chaque cellule avec votre stratégie.
          </p>
        </div>
        <StrategyMatrixHelpDialog />
      </div>

      <StrategyMatrixForm
        mode="create"
        games={games}
        charactersByGame={charactersByGame}
      />
    </div>
  );
}
