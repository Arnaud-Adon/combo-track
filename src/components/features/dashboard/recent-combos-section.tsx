import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { RecentCombos } from "../../../../prisma/query/combo.query";
import { ComboCard } from "../combo/combo-card";

type RecentCombosSectionProps = {
  combos: RecentCombos;
};

export function RecentCombosSection({ combos }: RecentCombosSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Derniers combos</h2>
        <Link
          href="/combos"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors hover:underline"
        >
          Voir tout <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {combos.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          <p>Aucun combo pour le moment.</p>
          <p className="mt-2 text-sm">Créez votre premier combo !</p>
        </div>
      ) : (
        <div className="space-y-3">
          {combos.map((combo) => (
            <ComboCard key={combo.id} combo={combo} />
          ))}
        </div>
      )}
    </section>
  );
}
