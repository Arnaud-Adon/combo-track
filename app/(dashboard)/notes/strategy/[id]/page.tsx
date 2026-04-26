import { StrategyMatrixForm } from "@/components/features/strategy-matrix/strategy-matrix-form";
import { StrategyMatrixHelpDialog } from "@/components/features/strategy-matrix/strategy-matrix-help-dialog";
import { requireAuth } from "@/lib/auth-utils";
import { notFound } from "next/navigation";
import { getStrategyMatrixById } from "../../../../../prisma/query/strategy-matrix.query";

export default async function StrategyMatrixDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAuth();
  const matrix = await getStrategyMatrixById({ id, userId: user.id });

  if (!matrix) notFound();

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{matrix.title}</h1>
          {matrix.description && (
            <p className="text-muted-foreground mt-1">{matrix.description}</p>
          )}
        </div>
        <StrategyMatrixHelpDialog />
      </div>

      <StrategyMatrixForm
        mode="edit"
        matrixId={matrix.id}
        initialData={{
          title: matrix.title,
          description: matrix.description ?? undefined,
          myAxis: matrix.myAxis,
          opponentAxis: matrix.opponentAxis,
          cells: matrix.cells,
        }}
      />
    </div>
  );
}
