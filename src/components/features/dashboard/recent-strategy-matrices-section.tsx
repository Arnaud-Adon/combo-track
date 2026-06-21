import { getTranslations } from "next-intl/server";

import { RecentStrategyMatrices } from "../../../../prisma/query/strategy-matrix.query";
import { RecentSection } from "./recent-section";
import { StrategyMatrixCard } from "./strategy-matrix-card";

type RecentStrategyMatricesSectionProps = {
  matrices: RecentStrategyMatrices;
};

export async function RecentStrategyMatricesSection({
  matrices,
}: RecentStrategyMatricesSectionProps) {
  const t = await getTranslations("dashboard");

  return (
    <RecentSection
      items={matrices}
      renderItem={(matrix) => <StrategyMatrixCard matrix={matrix} />}
      index="01"
      title={t("recentMatrices.title")}
      viewAllHref="/notes/strategy"
      emptyText={t("recentMatrices.empty")}
      emptyHint={t("recentMatrices.emptyHint")}
      newHref="/notes/strategy/new"
      newLabel={t("actions.newMatrix")}
    />
  );
}
