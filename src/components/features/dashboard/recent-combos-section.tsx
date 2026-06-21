import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { RecentCombos } from "../../../../prisma/query/combo.query";
import { ComboCard } from "../combo/combo-card";
import { SectionHeader } from "./section-header";

type RecentCombosSectionProps = {
  combos: RecentCombos;
};

export async function RecentCombosSection({
  combos,
}: RecentCombosSectionProps) {
  const t = await getTranslations("dashboard");

  return (
    <section className="space-y-5">
      <SectionHeader index="03" title={t("recentCombos.title")} href="/combos" />

      {combos.length === 0 ? (
        <div className="border-border text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
          <p className="font-mono text-sm">{t("recentCombos.empty")}</p>
          <p className="text-sm">{t("recentCombos.emptyHint")}</p>
          <Button asChild variant="outline" size="sm" className="mt-1">
            <Link href="/combos/new">
              <Plus className="size-4" />
              {t("actions.newCombo")}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {combos.map((combo, index) => (
            <div
              key={combo.id}
              className="fgc-rise"
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              <ComboCard combo={combo} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
