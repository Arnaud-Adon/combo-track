import { requireAdmin } from "@/lib/auth-utils";
import { getArticleByIdForAdmin } from "@/../prisma/query/admin-glossary.query";
import { ArticleForm } from "@/components/features/admin/glossary/article-form";
import { notFound } from "next/navigation";

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

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Éditer l&apos;article</h1>
      <ArticleForm mode="edit" article={article} />
    </div>
  );
}
