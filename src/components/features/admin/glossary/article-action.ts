"use server";

import { prisma } from "@/lib/prisma";
import { adminActionClient } from "@/lib/admin-action";
import { assertSlugAvailable, runDelete } from "@/lib/admin/entity-actions";
import { embedGlossaryArticleIfNeeded } from "@/lib/rag/embed-content";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { getTranslations } from "next-intl/server";
import { createArticleSchema, updateArticleSchema } from "./article-schema";
import z from "zod";

export const createArticleAction = adminActionClient
  .inputSchema(createArticleSchema)
  .action(async ({ parsedInput, ctx }) => {
    const t = await getTranslations("admin");
    const { title, slug, content, excerpt, category, image, published } =
      parsedInput;

    await assertSlugAvailable(
      () => prisma.glossaryArticle.findUnique({ where: { slug } }),
      t("article.errors.slugExists"),
    );

    const article = await prisma.glossaryArticle.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        category,
        image: image ?? null,
        published,
        createdBy: ctx.user.id,
      },
    });

    after(async () => {
      await embedGlossaryArticleIfNeeded(
        article.id,
        article.title,
        article.content,
      );
    });

    revalidatePath("/glossary");
    revalidatePath("/admin/glossary");

    return article;
  });

export const updateArticleAction = adminActionClient
  .inputSchema(updateArticleSchema)
  .action(async ({ parsedInput }) => {
    const t = await getTranslations("admin");
    const { id, title, slug, content, excerpt, category, image, published } =
      parsedInput;

    await assertSlugAvailable(
      () => prisma.glossaryArticle.findFirst({ where: { slug, NOT: { id } } }),
      t("article.errors.slugExists"),
    );

    const article = await prisma.glossaryArticle.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        category,
        image: image ?? null,
        published,
      },
    });

    after(async () => {
      await embedGlossaryArticleIfNeeded(
        article.id,
        article.title,
        article.content,
      );
    });

    revalidatePath("/glossary");
    revalidatePath("/admin/glossary");

    return article;
  });

export const deleteArticleAction = adminActionClient
  .inputSchema(
    z.object({ id: z.string().min(1, "admin.validation.article.idRequired") }),
  )
  .action(async ({ parsedInput }) =>
    runDelete(
      (id) => prisma.glossaryArticle.delete({ where: { id } }),
      parsedInput.id,
      ["/glossary", "/admin/glossary"],
    ),
  );
