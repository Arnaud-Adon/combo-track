import { requireAdmin } from "@/lib/auth-utils";
import { getAllCharactersForAdmin } from "@/../prisma/query/admin-character.query";
import { CharacterList } from "@/components/features/admin/character/character-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminCharactersPage() {
  await requireAdmin();
  const characters = await getAllCharactersForAdmin();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des personnages</h1>
          <p className="text-muted-foreground mt-1">
            {characters.length} personnage{characters.length > 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/characters/new">
            <Plus className="mr-2 h-4 w-4" />
            Créer un personnage
          </Link>
        </Button>
      </div>
      <CharacterList characters={characters} />
    </div>
  );
}
