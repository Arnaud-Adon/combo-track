import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { ComboListItem } from "@/../prisma/query/combo.query";

import { ComboCard } from "./combo-card";

interface ComboListProps {
  combos: ComboListItem[];
}

export async function ComboList({ combos }: ComboListProps) {
  const t = await getTranslations("combo");

  if (combos.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground mb-4">{t("list.empty")}</p>
        <Button asChild>
          <Link href="/combos/new">{t("list.createFirst")}</Link>
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
