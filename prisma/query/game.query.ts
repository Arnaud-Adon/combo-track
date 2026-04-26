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
