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
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[320px]"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 50% 0%, var(--fgc-accent-soft) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-muted-foreground mb-2 font-mono text-[10px] tracking-[0.2em] uppercase">
              <span className="text-primary">Matrice</span> · Nouvelle
            </div>
            <h1 className="font-display text-2xl uppercase md:text-3xl">
              Prépare un matchup
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
              Croise tes ressources et celles de l&apos;adversaire, puis remplis
              chaque cellule avec ta stratégie optimale.
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
    </div>
  );
}
