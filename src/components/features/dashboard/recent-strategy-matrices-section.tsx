import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { RecentStrategyMatrices } from "../../../../prisma/query/strategy-matrix.query";
import { SectionHeader } from "./section-header";
import { StrategyMatrixCard } from "./strategy-matrix-card";

type RecentStrategyMatricesSectionProps = {
  matrices: RecentStrategyMatrices;
};

export async function RecentStrategyMatricesSection({
  matrices,
}: RecentStrategyMatricesSectionProps) {
  const t = await getTranslations("dashboard");

  return (
    <section className="space-y-5">
      <SectionHeader
        index="01"
        title={t("recentMatrices.title")}
        href="/notes/strategy"
      />

      {matrices.length === 0 ? (
        <div className="border-border text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
          <p className="font-mono text-sm">{t("recentMatrices.empty")}</p>
          <p className="text-sm">{t("recentMatrices.emptyHint")}</p>
          <Button asChild variant="outline" size="sm" className="mt-1">
            <Link href="/notes/strategy/new">
              <Plus className="size-4" />
              {t("actions.newMatrix")}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {matrices.map((matrix, index) => (
            <div
              key={matrix.id}
              className="fgc-rise"
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              <StrategyMatrixCard matrix={matrix} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
