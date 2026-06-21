import { StrategyMatrixForm } from "@/components/features/strategy-matrix/strategy-matrix-form";
import { StrategyMatrixHelpDialog } from "@/components/features/strategy-matrix/strategy-matrix-help-dialog";
import { requireAuth } from "@/lib/auth-utils";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations("strategyMatrix");
  const [matrix, games, charactersByGame] = await Promise.all([
    getStrategyMatrixById({ id, userId: user.id }),
    getGameOptions(),
    getAllCharactersGroupedByGame(),
  ]);

  if (!matrix) notFound();

  const matchupBadges = [
    matrix.game?.name,
    matrix.myCharacter?.name,
    matrix.opponentCharacter?.name && `vs ${matrix.opponentCharacter.name}`,
  ].filter(Boolean);

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
          <div className="min-w-0 space-y-2">
            <div className="text-muted-foreground mb-1 font-mono text-[10px] tracking-[0.2em] uppercase">
              <span className="text-primary">
                {t("page.detail.eyebrowLabel")}
              </span>{" "}
              · {t("page.detail.eyebrowValue")}
            </div>
            <h1 className="font-display text-2xl uppercase md:text-3xl">
              {matrix.title}
            </h1>
            {matchupBadges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {matchupBadges.map((label) => (
                  <span
                    key={label}
                    className="border-border bg-secondary text-muted-foreground rounded-full border px-2.5 py-0.5 font-mono text-xs"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
            {matrix.description && (
              <p className="text-muted-foreground max-w-2xl text-sm">
                {matrix.description}
              </p>
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
    </div>
  );
}
