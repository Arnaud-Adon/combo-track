import { requireAdmin } from "@/lib/auth-utils";
import { getAllGamesForAdmin } from "@/../prisma/query/admin-game.query";
import { GameList } from "@/components/features/admin/game/game-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function AdminGamesPage() {
  await requireAdmin();
  const games = await getAllGamesForAdmin();
  const t = await getTranslations("admin");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">
            {t("game.pages.listTitle")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("game.pages.count", { count: games.length })}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/games/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("game.pages.createCta")}
          </Link>
        </Button>
      </div>
      <GameList games={games} />
    </div>
  );
}
