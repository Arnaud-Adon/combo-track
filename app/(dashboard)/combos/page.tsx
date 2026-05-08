import Link from "next/link";
import { Plus } from "lucide-react";

import { requireAuth } from "@/lib/auth-utils";
import { getCombosByUser } from "@/../prisma/query/combo.query";
import { ComboList } from "@/components/features/combo/combo-list";
import { Button } from "@/components/ui/button";

export default async function CombosPage() {
  const user = await requireAuth();
  const combos = await getCombosByUser({ userId: user.id });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes combos</h1>
          <p className="text-muted-foreground mt-1">
            {combos.length} combo{combos.length > 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/combos/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau combo
          </Link>
        </Button>
      </div>
      <ComboList combos={combos} />
    </div>
  );
}
