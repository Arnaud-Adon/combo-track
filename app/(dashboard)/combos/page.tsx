import Link from "next/link";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { requireAuth } from "@/lib/auth-utils";
import { getCombosByUser } from "@/../prisma/query/combo.query";
import { ComboList } from "@/components/features/combo/combo-list";
import { Button } from "@/components/ui/button";

export default async function CombosPage() {
  const user = await requireAuth();
  const combos = await getCombosByUser({ userId: user.id });
  const t = await getTranslations("combo");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">
            {t("pages.listTitle")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("pages.count", { count: combos.length })}
          </p>
        </div>
        <Button asChild>
          <Link href="/combos/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("pages.createCta")}
          </Link>
        </Button>
      </div>
      <ComboList combos={combos} />
    </div>
  );
}
