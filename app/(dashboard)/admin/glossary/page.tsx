import { requireAdmin } from "@/lib/auth-utils";
import { getAllArticlesForAdmin } from "@/../prisma/query/admin-glossary.query";
import { ArticleList } from "@/components/features/admin/glossary/article-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminGlossaryPage() {
  await requireAdmin();
  const articles = await getAllArticlesForAdmin();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion du Glossaire</h1>
          <p className="text-muted-foreground mt-1">
            {articles.length} article{articles.length > 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/glossary/new">
            <Plus className="mr-2 h-4 w-4" />
            Créer un article
          </Link>
        </Button>
      </div>
      <ArticleList articles={articles} />
    </div>
  );
}
