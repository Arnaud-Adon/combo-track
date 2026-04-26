import { requireAdmin } from "@/lib/auth-utils";
import { getGameByIdForAdmin } from "@/../prisma/query/admin-game.query";
import { GameForm } from "@/components/features/admin/game/game-form";
import { notFound } from "next/navigation";

interface EditGamePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGamePage({ params }: EditGamePageProps) {
  await requireAdmin();
  const { id } = await params;
  const game = await getGameByIdForAdmin(id);

  if (!game) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Modifier le jeu</h1>
      <GameForm mode="edit" game={game} />
    </div>
  );
}
