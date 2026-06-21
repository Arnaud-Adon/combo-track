import { getTranslations } from "next-intl/server";

import { RecentCombos } from "../../../../prisma/query/combo.query";
import { ComboCard } from "../combo/combo-card";
import { RecentSection } from "./recent-section";

type RecentCombosSectionProps = {
  combos: RecentCombos;
};

export async function RecentCombosSection({
  combos,
}: RecentCombosSectionProps) {
  const t = await getTranslations("dashboard");

  return (
    <RecentSection
      items={combos}
      renderItem={(combo) => <ComboCard combo={combo} />}
      layout="grid"
      index="03"
      title={t("recentCombos.title")}
      viewAllHref="/combos"
      emptyText={t("recentCombos.empty")}
      emptyHint={t("recentCombos.emptyHint")}
      newHref="/combos/new"
      newLabel={t("actions.newCombo")}
    />
  );
}
