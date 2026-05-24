import { ReplayCard } from "@/components/features/dashboard/replay-card";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getMatchesByUser } from "../../prisma/query/match.query";

export default async function VideosPage() {
  const user = await requireAuth();
  const matches = await getMatchesByUser({ userId: user.id });

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes replays</h1>
          <p className="text-muted-foreground mt-1">
            {matches.length} replay{matches.length > 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/videos/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau replay
          </Link>
        </Button>
      </div>

      {matches.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          <p>Aucun replay pour le moment.</p>
          <p className="mt-2 text-sm">
            Ajoutez votre premier replay avec un lien YouTube !
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => (
            <ReplayCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
