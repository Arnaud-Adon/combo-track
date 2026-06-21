import { requireAdmin } from "@/lib/auth-utils";
import { getAllArticlesForAdmin } from "@/../prisma/query/admin-glossary.query";
import { ArticleList } from "@/components/features/admin/glossary/article-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function AdminGlossaryPage() {
  await requireAdmin();
  const articles = await getAllArticlesForAdmin();
  const t = await getTranslations("admin");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">
            {t("article.pages.listTitle")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("article.pages.count", { count: articles.length })}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/glossary/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("article.pages.createCta")}
          </Link>
        </Button>
      </div>
      <ArticleList articles={articles} />
    </div>
  );
}
