import { requireAdmin } from "@/lib/auth-utils";
import { getGameOptions } from "@/../prisma/query/game.query";
import { CharacterForm } from "@/components/features/admin/character/character-form";
import { getTranslations } from "next-intl/server";

export default async function NewCharacterPage() {
  await requireAdmin();
  const games = await getGameOptions();
  const t = await getTranslations("admin");

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold font-display">
        {t("character.pages.newTitle")}
      </h1>
      <CharacterForm mode="create" games={games} />
    </div>
  );
}
