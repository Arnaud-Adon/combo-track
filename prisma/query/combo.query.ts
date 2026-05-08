import { prisma } from "@/lib/prisma";
import { Prisma } from "../../generated/prisma";

const comboInclude = {
  character: {
    select: {
      id: true,
      slug: true,
      name: true,
      iconUrl: true,
      game: {
        select: { id: true, slug: true, name: true, iconUrl: true },
      },
    },
  },
  tags: { select: { id: true, name: true } },
} satisfies Prisma.ComboInclude;

export const getCombosByUser = async ({
  userId,
  characterId,
  gameId,
}: {
  userId: string;
  characterId?: string;
  gameId?: string;
}) =>
  await prisma.combo.findMany({
    where: {
      userId,
      ...(characterId ? { characterId } : {}),
      ...(gameId ? { gameId } : {}),
    },
    include: comboInclude,
    orderBy: { createdAt: "desc" },
  });

export type ComboListItem = Prisma.PromiseReturnType<
  typeof getCombosByUser
>[number];

export const getRecentCombosForUser = async ({
  userId,
  limit = 5,
}: {
  userId: string;
  limit?: number;
}) =>
  await prisma.combo.findMany({
    where: { userId },
    include: comboInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

export type RecentCombos = Prisma.PromiseReturnType<
  typeof getRecentCombosForUser
>;

export const getComboById = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) =>
  await prisma.combo.findFirst({
    where: { id, userId },
    include: {
      ...comboInclude,
      sourceNote: {
        select: {
          id: true,
          content: true,
          timestamp: true,
          match: {
            select: { id: true, title: true },
          },
        },
      },
    },
  });

export type ComboDetail = NonNullable<
  Prisma.PromiseReturnType<typeof getComboById>
>;
