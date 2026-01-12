import { prisma } from "@/lib/prisma";
import { Prisma } from "../../generated/prisma";

export const getAllPublishedArticles = async (category?: string) =>
  await prisma.glossaryArticle.findMany({
    where: {
      published: true,
      ...(category && { category }),
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      createdAt: true,
      creator: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { title: "asc" },
  });

export const getArticleBySlug = async (slug: string) =>
  await prisma.glossaryArticle.findUnique({
    where: {
      slug,
      published: true,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      content: true,
      category: true,
      createdAt: true,
      updatedAt: true,
      creator: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

export const getGlossaryCategories = async () => {
  const categories = await prisma.glossaryArticle.findMany({
    where: {
      published: true,
      category: { not: null },
    },
    select: {
      category: true,
    },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });

  return categories
    .map((c) => c.category)
    .filter((c): c is string => c !== null);
};

export type PublishedArticles = Prisma.PromiseReturnType<
  typeof getAllPublishedArticles
>;
export type ArticleDetail = Prisma.PromiseReturnType<typeof getArticleBySlug>;
