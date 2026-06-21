import { getTranslations } from "next-intl/server";

import { RecentMatches } from "../../../../prisma/query/match.query";
import { RecentSection } from "./recent-section";
import { ReplayCard } from "./replay-card";

type RecentMatchesSectionProps = {
  matches: RecentMatches;
};

export async function RecentMatchesSection({
  matches,
}: RecentMatchesSectionProps) {
  const t = await getTranslations("dashboard");

  return (
    <RecentSection
      items={matches}
      renderItem={(match) => <ReplayCard match={match} />}
      index="02"
      title={t("recentMatches.title")}
      viewAllHref="/videos"
      emptyText={t("recentMatches.empty")}
      emptyHint={t("recentMatches.emptyHint")}
      newHref="/videos/new"
      newLabel={t("actions.newReplay")}
    />
  );
}
