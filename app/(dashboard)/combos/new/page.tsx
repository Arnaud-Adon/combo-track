import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { getAllCharactersWithGame } from "@/../prisma/query/character.query";
import { ComboForm } from "@/components/features/combo/combo-form";

interface NewComboPageProps {
  searchParams: Promise<{ fromNote?: string; characterId?: string }>;
}

export default async function NewComboPage({ searchParams }: NewComboPageProps) {
  const user = await requireAuth();
  const { fromNote, characterId } = await searchParams;

  const [characters, tags] = await Promise.all([
    getAllCharactersWithGame(),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  let prefillContent: string | undefined;
  let resolvedCharacterId = characterId;
  let resolvedSourceNoteId: string | undefined;

  if (fromNote) {
    const note = await prisma.note.findUnique({
      where: { id: fromNote },
      select: {
        id: true,
        content: true,
        characterId: true,
        match: { select: { userId: true } },
      },
    });
    if (note && note.match.userId === user.id) {
      prefillContent = note.content;
      resolvedSourceNoteId = note.id;
      if (!resolvedCharacterId && note.characterId) {
        resolvedCharacterId = note.characterId;
      }
    }
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Créer un nouveau combo</h1>
      <ComboForm
        mode="create"
        characters={characters}
        availableTags={tags}
        defaultCharacterId={resolvedCharacterId}
        sourceNoteId={resolvedSourceNoteId}
        prefillContent={prefillContent}
      />
    </div>
  );
}
