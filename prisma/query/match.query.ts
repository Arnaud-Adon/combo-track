import { prisma } from "@/lib/prisma";
import { Prisma } from "../../generated/prisma";

export const getRecentMatches = async ({ userId }: { userId: string }) =>
  await prisma.match.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      title: true,
      matchType: true,
      status: true,
      duration: true,
      createdAt: true,
      _count: {
        select: {
          notes: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

export type RecentMatches = Prisma.PromiseReturnType<typeof getRecentMatches>;
