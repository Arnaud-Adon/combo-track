import { requireAdmin } from "@/lib/auth-utils";
import { GameForm } from "@/components/features/admin/game/game-form";

export default async function NewGamePage() {
  await requireAdmin();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Créer un nouveau jeu</h1>
      <GameForm mode="create" />
    </div>
  );
}
