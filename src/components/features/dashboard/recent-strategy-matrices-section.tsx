import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { RecentStrategyMatrices } from "../../../../prisma/query/strategy-matrix.query";
import { StrategyMatrixCard } from "./strategy-matrix-card";

type RecentStrategyMatricesSectionProps = {
  matrices: RecentStrategyMatrices;
};

export function RecentStrategyMatricesSection({
  matrices,
}: RecentStrategyMatricesSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Dernières matrices de stratégie</h2>
        <Link
          href="/notes/strategy"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors hover:underline"
        >
          Voir tout <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {matrices.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          <p>Aucune matrice pour le moment.</p>
          <p className="mt-2 text-sm">
            Créez votre première matrice de stratégie !
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {matrices.map((matrix) => (
            <StrategyMatrixCard key={matrix.id} matrix={matrix} />
          ))}
        </div>
      )}
    </section>
  );
}
