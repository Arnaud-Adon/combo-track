import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { RecentStrategyMatrices } from "../../../../prisma/query/strategy-matrix.query";
import { SectionHeader } from "./section-header";
import { StrategyMatrixCard } from "./strategy-matrix-card";

type RecentStrategyMatricesSectionProps = {
  matrices: RecentStrategyMatrices;
};

export function RecentStrategyMatricesSection({
  matrices,
}: RecentStrategyMatricesSectionProps) {
  return (
    <section className="space-y-5">
      <SectionHeader
        index="01"
        title="Dernières matrices"
        href="/notes/strategy"
      />

      {matrices.length === 0 ? (
        <div className="border-border text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
          <p className="font-mono text-sm">Aucune matrice pour le moment.</p>
          <p className="text-sm">Prépare ton premier matchup avant le set.</p>
          <Button asChild variant="outline" size="sm" className="mt-1">
            <Link href="/notes/strategy/new">
              <Plus className="size-4" />
              Nouvelle matrice
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
