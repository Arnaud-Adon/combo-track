import { requireAdmin } from "@/lib/auth-utils";
import { getAllCharactersForAdmin } from "@/../prisma/query/admin-character.query";
import { CharacterList } from "@/components/features/admin/character/character-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function AdminCharactersPage() {
  await requireAdmin();
  const characters = await getAllCharactersForAdmin();
  const t = await getTranslations("admin");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">
            {t("character.pages.listTitle")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("character.pages.count", { count: characters.length })}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/characters/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("character.pages.createCta")}
          </Link>
        </Button>
      </div>
      <CharacterList characters={characters} />
    </div>
  );
}
