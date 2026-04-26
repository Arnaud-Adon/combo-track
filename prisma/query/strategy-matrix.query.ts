import {
  axisSchema,
  cellSchema,
  type Axis,
  type Cell,
} from "@/components/features/strategy-matrix/strategy-matrix-schema";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { Prisma } from "../../generated/prisma";

export const getStrategyMatrices = async ({ userId }: { userId: string }) =>
  await prisma.strategyMatrix.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      description: true,
      myAxis: true,
      opponentAxis: true,
      pinned: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
  });

export type StrategyMatrixListItem = Prisma.PromiseReturnType<
  typeof getStrategyMatrices
>[number];

export const getStrategyMatrixById = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  const matrix = await prisma.strategyMatrix.findFirst({
    where: { id, userId },
  });

  if (!matrix) return null;

  const myAxis = axisSchema.parse(matrix.myAxis);
  const opponentAxis = axisSchema.parse(matrix.opponentAxis);
  const cells = z.array(cellSchema).parse(matrix.cells);

  return {
    id: matrix.id,
    userId: matrix.userId,
    title: matrix.title,
    description: matrix.description,
    pinned: matrix.pinned,
    createdAt: matrix.createdAt,
    updatedAt: matrix.updatedAt,
    myAxis,
    opponentAxis,
    cells,
  };
};

export type StrategyMatrixDetail = NonNullable<
  Awaited<ReturnType<typeof getStrategyMatrixById>>
>;

export type StrategyMatrixListAxis = Axis;
export type StrategyMatrixListCell = Cell;
