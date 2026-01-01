import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { RecentMatches } from "../../../../prisma/query/match.query";
import { ReplayCard } from "./replay-card";

type RecentMatchesSectionProps = {
  matches: RecentMatches;
};

export function RecentMatchesSection({ matches }: RecentMatchesSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Derniers replays</h2>
        <Link
          href="/videos"
          className="flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-white hover:underline"
        >
          Voir tout <ArrowRight className="h-4 w-4" />
        </Link>
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
    </section>
  );
}
