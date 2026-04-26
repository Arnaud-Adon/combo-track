import { prisma } from "@/lib/prisma";
import { Prisma } from "../../generated/prisma";

export const getAllGamesForAdmin = async () =>
  await prisma.game.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      iconUrl: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          characters: true,
          combos: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

export const getGameByIdForAdmin = async (id: string) =>
  await prisma.game.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      name: true,
      iconUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

export type AdminGameList = Prisma.PromiseReturnType<typeof getAllGamesForAdmin>;
export type AdminGameDetail = Prisma.PromiseReturnType<
  typeof getGameByIdForAdmin
>;
