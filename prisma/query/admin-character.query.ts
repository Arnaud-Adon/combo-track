import { prisma } from "@/lib/prisma";
import { Prisma } from "../../generated/prisma";

export const getAllCharactersForAdmin = async () =>
  await prisma.character.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      iconUrl: true,
      createdAt: true,
      updatedAt: true,
      game: {
        select: {
          id: true,
          slug: true,
          name: true,
          iconUrl: true,
        },
      },
      _count: {
        select: {
          combos: true,
          notes: true,
        },
      },
    },
    orderBy: [{ game: { name: "asc" } }, { name: "asc" }],
  });

export const getCharacterByIdForAdmin = async (id: string) =>
  await prisma.character.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      name: true,
      iconUrl: true,
      gameId: true,
      createdAt: true,
      updatedAt: true,
      game: {
        select: {
          id: true,
          slug: true,
          name: true,
          iconUrl: true,
        },
      },
    },
  });

export type AdminCharacterList = Prisma.PromiseReturnType<
  typeof getAllCharactersForAdmin
>;
export type AdminCharacterDetail = Prisma.PromiseReturnType<
  typeof getCharacterByIdForAdmin
>;
