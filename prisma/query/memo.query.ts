import { prisma } from "@/lib/prisma";
import { Prisma } from "../../generated/prisma";

export const getMemosByUser = async ({ userId }: { userId: string }) =>
  await prisma.memo.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

export type MemoListItem = Prisma.PromiseReturnType<
  typeof getMemosByUser
>[number];

export const getMemoById = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) =>
  await prisma.memo.findFirst({
    where: { id, userId },
  });

export type MemoDetail = NonNullable<
  Prisma.PromiseReturnType<typeof getMemoById>
>;
