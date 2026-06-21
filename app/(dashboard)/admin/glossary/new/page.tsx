import { requireAdmin } from "@/lib/auth-utils";
import { ArticleForm } from "@/components/features/admin/glossary/article-form";
import { getTranslations } from "next-intl/server";

export default async function NewArticlePage() {
  await requireAdmin();
  const t = await getTranslations("admin");

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold font-display">
        {t("article.pages.newTitle")}
      </h1>
      <ArticleForm mode="create" />
    </div>
  );
}
