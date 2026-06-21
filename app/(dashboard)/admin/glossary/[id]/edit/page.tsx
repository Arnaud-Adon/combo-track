import { requireAdmin } from "@/lib/auth-utils";
import { getArticleByIdForAdmin } from "@/../prisma/query/admin-glossary.query";
import { ArticleForm } from "@/components/features/admin/glossary/article-form";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  await requireAdmin();
  const { id } = await params;
  const article = await getArticleByIdForAdmin(id);

  if (!article) {
    notFound();
  }

  const t = await getTranslations("admin");

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold font-display">
        {t("article.pages.editTitle")}
      </h1>
      <ArticleForm mode="edit" article={article} />
    </div>
  );
}
