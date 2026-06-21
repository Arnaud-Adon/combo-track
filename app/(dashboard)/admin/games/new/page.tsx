import { requireAdmin } from "@/lib/auth-utils";
import { GameForm } from "@/components/features/admin/game/game-form";
import { getTranslations } from "next-intl/server";

export default async function NewGamePage() {
  await requireAdmin();
  const t = await getTranslations("admin");

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold font-display">
        {t("game.pages.newTitle")}
      </h1>
      <GameForm mode="create" />
    </div>
  );
}
