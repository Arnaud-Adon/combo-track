import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { RecentMatches } from "../../../../prisma/query/match.query";
import { ReplayCard } from "./replay-card";
import { SectionHeader } from "./section-header";

type RecentMatchesSectionProps = {
  matches: RecentMatches;
};

export async function RecentMatchesSection({
  matches,
}: RecentMatchesSectionProps) {
  const t = await getTranslations("dashboard");

  return (
    <section className="space-y-5">
      <SectionHeader
        index="02"
        title={t("recentMatches.title")}
        href="/videos"
      />

      {matches.length === 0 ? (
        <div className="border-border text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
          <p className="font-mono text-sm">{t("recentMatches.empty")}</p>
          <p className="text-sm">{t("recentMatches.emptyHint")}</p>
          <Button asChild variant="outline" size="sm" className="mt-1">
            <Link href="/videos/new">
              <Plus className="size-4" />
              {t("actions.newReplay")}
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
