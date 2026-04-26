import { StrategyMatrixList } from "@/components/features/strategy-matrix/strategy-matrix-list";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getStrategyMatrices } from "../../../../prisma/query/strategy-matrix.query";

export default async function StrategyMatrixListPage() {
  const user = await requireAuth();
  const matrices = await getStrategyMatrices({ userId: user.id });

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Matrices de stratégie</h1>
          <p className="text-muted-foreground mt-1">
            Vos plans de jeu conditionnels par état des ressources.
          </p>
        </div>
        <Button asChild>
          <Link href="/notes/strategy/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle matrice
          </Link>
        </Button>
      </div>

      <StrategyMatrixList matrices={matrices} />
    </div>
  );
}
