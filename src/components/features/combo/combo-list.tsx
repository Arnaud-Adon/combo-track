import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ComboListItem } from "@/../prisma/query/combo.query";

import { ComboCard } from "./combo-card";

interface ComboListProps {
  combos: ComboListItem[];
}

export function ComboList({ combos }: ComboListProps) {
  if (combos.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground mb-4">
          Aucun combo pour le moment
        </p>
        <Button asChild>
          <Link href="/combos/new">Créer votre premier combo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {combos.map((combo) => (
        <ComboCard key={combo.id} combo={combo} />
      ))}
    </div>
  );
}
