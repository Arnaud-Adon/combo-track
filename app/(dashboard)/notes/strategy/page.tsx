import { StrategyMatrixFilters } from "@/components/features/strategy-matrix/strategy-matrix-filters";
import { StrategyMatrixList } from "@/components/features/strategy-matrix/strategy-matrix-list";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utils";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  getAllCharactersGroupedByGame,
  getGameOptions,
  getStrategyMatrices,
} from "../../../../prisma/query/strategy-matrix.query";

export default async function StrategyMatrixListPage({
  searchParams,
}: {
  searchParams: Promise<{ gameId?: string; characterId?: string }>;
}) {
  const user = await requireAuth();
  const t = await getTranslations("strategyMatrix");
  const params = await searchParams;
  const filters = {
    gameId: params.gameId,
    characterId: params.characterId,
  };

  const [matrices, games, charactersByGame] = await Promise.all([
    getStrategyMatrices({ userId: user.id, filters }),
    getGameOptions(),
    getAllCharactersGroupedByGame(),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("page.list.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("page.list.subtitle")}
          </p>
        </div>
        <Button asChild>
          <Link href="/notes/strategy/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("page.list.new")}
          </Link>
        </Button>
      </div>

      <StrategyMatrixFilters
        games={games}
        charactersByGame={charactersByGame}
        selectedGameId={filters.gameId}
        selectedCharacterId={filters.characterId}
      />

      <StrategyMatrixList matrices={matrices} />
    </div>
  );
}
