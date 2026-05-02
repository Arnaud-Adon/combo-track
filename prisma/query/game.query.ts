import { prisma } from "@/lib/prisma";
import { Prisma } from "../../generated/prisma";

export const getAllGames = async () =>
  await prisma.game.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      iconUrl: true,
    },
    orderBy: { name: "asc" },
  });

export type GameList = Prisma.PromiseReturnType<typeof getAllGames>;

export const getGameOptions = async () =>
  await prisma.game.findMany({
    select: { id: true, name: true, slug: true, iconUrl: true },
    orderBy: { name: "asc" },
  });

export type GameOption = Prisma.PromiseReturnType<typeof getGameOptions>[number];
