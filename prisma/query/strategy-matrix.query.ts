import {
  axisSchema,
  cellSchema,
  type Axis,
  type Cell,
} from "@/components/features/strategy-matrix/strategy-matrix-schema";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { Prisma } from "../../generated/prisma";

type ListFilters = {
  gameId?: string;
  characterId?: string;
};

export const getStrategyMatrices = async ({
  userId,
  filters,
}: {
  userId: string;
  filters?: ListFilters;
}) => {
  const where: Prisma.StrategyMatrixWhereInput = {
    userId,
    ...(filters?.gameId ? { gameId: filters.gameId } : {}),
    ...(filters?.characterId
      ? {
          OR: [
            { myCharacterId: filters.characterId },
            { opponentCharacterId: filters.characterId },
          ],
        }
      : {}),
  };

  return await prisma.strategyMatrix.findMany({
    where,
    select: {
      id: true,
      title: true,
      description: true,
      myAxis: true,
      opponentAxis: true,
      pinned: true,
      createdAt: true,
      updatedAt: true,
      game: { select: { id: true, name: true, slug: true, iconUrl: true } },
      myCharacter: {
        select: { id: true, name: true, slug: true, iconUrl: true },
      },
      opponentCharacter: {
        select: { id: true, name: true, slug: true, iconUrl: true },
      },
    },
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
  });
};

export type StrategyMatrixListItem = Prisma.PromiseReturnType<
  typeof getStrategyMatrices
>[number];

export const getRecentStrategyMatrices = async ({
  userId,
}: {
  userId: string;
}) => {
  const matrices = await prisma.strategyMatrix.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      createdAt: true,
      cells: true,
      game: { select: { id: true, name: true, slug: true, iconUrl: true } },
      myCharacter: {
        select: { id: true, name: true, slug: true, iconUrl: true },
      },
      opponentCharacter: {
        select: { id: true, name: true, slug: true, iconUrl: true },
      },
    },
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
    take: 5,
  });

  return matrices.map(({ cells, ...rest }) => {
    const parsed = z.array(cellSchema).safeParse(cells);
    const filledCellCount = parsed.success
      ? parsed.data.filter((c) => c.content.trim().length > 0).length
      : 0;
    return { ...rest, filledCellCount };
  });
};

export type RecentStrategyMatrices = Awaited<
  ReturnType<typeof getRecentStrategyMatrices>
>;

export const getStrategyMatrixById = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  const matrix = await prisma.strategyMatrix.findFirst({
    where: { id, userId },
    include: {
      game: { select: { id: true, name: true, slug: true, iconUrl: true } },
      myCharacter: {
        select: { id: true, name: true, slug: true, iconUrl: true },
      },
      opponentCharacter: {
        select: { id: true, name: true, slug: true, iconUrl: true },
      },
    },
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
    gameId: matrix.gameId,
    game: matrix.game,
    myCharacterId: matrix.myCharacterId,
    myCharacter: matrix.myCharacter,
    opponentCharacterId: matrix.opponentCharacterId,
    opponentCharacter: matrix.opponentCharacter,
    myAxis,
    opponentAxis,
    cells,
  };
};

export { getGameOptions, type GameOption } from "./game.query";
export {
  getCharactersByGame,
  getAllCharactersGroupedByGame,
  type CharacterOption,
} from "./character.query";

export const getDistinctUserGames = async ({ userId }: { userId: string }) => {
  const matrices = await prisma.strategyMatrix.findMany({
    where: { userId, gameId: { not: null } },
    select: {
      game: { select: { id: true, name: true, slug: true, iconUrl: true } },
    },
    distinct: ["gameId"],
  });
  return matrices
    .map((m) => m.game)
    .filter((g): g is NonNullable<typeof g> => g !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
};

export type StrategyMatrixDetail = NonNullable<
  Awaited<ReturnType<typeof getStrategyMatrixById>>
>;

export type StrategyMatrixListAxis = Axis;
export type StrategyMatrixListCell = Cell;
