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

export const getGameOptions = async () =>
  await prisma.game.findMany({
    select: { id: true, name: true, slug: true, iconUrl: true },
    orderBy: { name: "asc" },
  });

export type GameOption = Prisma.PromiseReturnType<typeof getGameOptions>[number];

export const getCharactersByGame = async ({ gameId }: { gameId: string }) =>
  await prisma.character.findMany({
    where: { gameId },
    select: { id: true, name: true, slug: true, iconUrl: true },
    orderBy: { name: "asc" },
  });

export type CharacterOption = Prisma.PromiseReturnType<
  typeof getCharactersByGame
>[number];

export const getAllCharactersGroupedByGame = async () => {
  const characters = await prisma.character.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      iconUrl: true,
      gameId: true,
    },
    orderBy: { name: "asc" },
  });

  const grouped: Record<string, CharacterOption[]> = {};
  for (const char of characters) {
    const { gameId, ...rest } = char;
    if (!grouped[gameId]) grouped[gameId] = [];
    grouped[gameId].push(rest);
  }
  return grouped;
};

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
