"use server";

import { prisma } from "@/lib/prisma";
import { adminActionClient } from "@/lib/admin-action";
import { revalidatePath } from "next/cache";
import { createArticleSchema, updateArticleSchema } from "./article-schema";
import z from "zod";

export const createArticleAction = adminActionClient
  .inputSchema(createArticleSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { title, slug, content, excerpt, category, published } = parsedInput;

    // Check slug uniqueness
    const existing = await prisma.glossaryArticle.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new Error("Un article avec ce slug existe déjà");
    }

    const article = await prisma.glossaryArticle.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        category,
        published,
        createdBy: ctx.user.id,
      },
    });

    revalidatePath("/glossary");
    revalidatePath("/admin/glossary");

    return article;
  });

export const updateArticleAction = adminActionClient
  .inputSchema(updateArticleSchema)
  .action(async ({ parsedInput }) => {
    const { id, title, slug, content, excerpt, category, published } =
      parsedInput;

    // Check slug uniqueness (excluding current article)
    const existing = await prisma.glossaryArticle.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });

    if (existing) {
      throw new Error("Un article avec ce slug existe déjà");
    }

    const article = await prisma.glossaryArticle.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        category,
        published,
      },
    });

    revalidatePath("/glossary");
    revalidatePath("/admin/glossary");

    return article;
  });

export const deleteArticleAction = adminActionClient
  .inputSchema(
    z.object({
      id: z.string().min(1, "L'ID de l'article est requis"),
    }),
  )
  .action(async ({ parsedInput }) => {
    await prisma.glossaryArticle.delete({
      where: { id: parsedInput.id },
    });

    revalidatePath("/glossary");
    revalidatePath("/admin/glossary");

    return { success: true };
  });
