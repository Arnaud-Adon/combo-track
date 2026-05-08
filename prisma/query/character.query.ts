import { prisma } from "@/lib/prisma";
import { Prisma } from "../../generated/prisma";

export const getCharactersByGame = async ({ gameId }: { gameId: string }) =>
  await prisma.character.findMany({
    where: { gameId },
    select: { id: true, name: true, slug: true, iconUrl: true },
    orderBy: { name: "asc" },
  });

export type CharacterOption = Prisma.PromiseReturnType<
  typeof getCharactersByGame
>[number];

export const getAllCharactersWithGame = async () =>
  await prisma.character.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      iconUrl: true,
      game: { select: { id: true, slug: true, name: true } },
    },
    orderBy: [{ game: { name: "asc" } }, { name: "asc" }],
  });

export type CharacterWithGame = Prisma.PromiseReturnType<
  typeof getAllCharactersWithGame
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
