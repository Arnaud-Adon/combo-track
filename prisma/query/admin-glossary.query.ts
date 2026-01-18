import { prisma } from "@/lib/prisma";
import { Prisma } from "../../generated/prisma";

export const getAllArticlesForAdmin = async () =>
  await prisma.glossaryArticle.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      creator: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

export const getArticleByIdForAdmin = async (id: string) =>
  await prisma.glossaryArticle.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      title: true,
      content: true,
      excerpt: true,
      category: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      creator: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

export type AdminArticleList = Prisma.PromiseReturnType<
  typeof getAllArticlesForAdmin
>;
export type AdminArticleDetail = Prisma.PromiseReturnType<
  typeof getArticleByIdForAdmin
>;
