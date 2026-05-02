import { requireAdmin } from "@/lib/auth-utils";
import { getCharacterByIdForAdmin } from "@/../prisma/query/admin-character.query";
import { getGameOptions } from "@/../prisma/query/game.query";
import { CharacterForm } from "@/components/features/admin/character/character-form";
import { notFound } from "next/navigation";

interface EditCharacterPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCharacterPage({
  params,
}: EditCharacterPageProps) {
  await requireAdmin();
  const { id } = await params;
  const [character, games] = await Promise.all([
    getCharacterByIdForAdmin(id),
    getGameOptions(),
  ]);

  if (!character) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Modifier le personnage</h1>
      <CharacterForm mode="edit" character={character} games={games} />
    </div>
  );
}
