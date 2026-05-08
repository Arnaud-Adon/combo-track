import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { getComboById } from "@/../prisma/query/combo.query";
import { getAllCharactersWithGame } from "@/../prisma/query/character.query";
import { ComboForm } from "@/components/features/combo/combo-form";

interface EditComboPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditComboPage({ params }: EditComboPageProps) {
  const user = await requireAuth();
  const { id } = await params;

  const [combo, characters, tags] = await Promise.all([
    getComboById({ id, userId: user.id }),
    getAllCharactersWithGame(),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!combo) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Modifier le combo</h1>
      <ComboForm
        mode="edit"
        combo={combo}
        characters={characters}
        availableTags={tags}
      />
    </div>
  );
}
