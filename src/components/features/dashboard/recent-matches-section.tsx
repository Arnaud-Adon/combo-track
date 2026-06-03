import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { RecentMatches } from "../../../../prisma/query/match.query";
import { ReplayCard } from "./replay-card";
import { SectionHeader } from "./section-header";

type RecentMatchesSectionProps = {
  matches: RecentMatches;
};

export function RecentMatchesSection({ matches }: RecentMatchesSectionProps) {
  return (
    <section className="space-y-5">
      <SectionHeader index="02" title="Derniers replays" href="/videos" />

      {matches.length === 0 ? (
        <div className="border-border text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
          <p className="font-mono text-sm">Aucun replay pour le moment.</p>
          <p className="text-sm">
            Colle un lien YouTube et commence à labber.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-1">
            <Link href="/videos/new">
              <Plus className="size-4" />
              Nouveau replay
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match, index) => (
            <div
              key={match.id}
              className="fgc-rise"
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              <ReplayCard match={match} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
