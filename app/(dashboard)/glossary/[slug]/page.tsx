import { ArticleDetail } from "@/components/features/glossary/glossary-article-detail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "../../../../prisma/query/glossary.query";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Link href="/glossary" className="mb-6 inline-block">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour au glossaire
        </Button>
      </Link>

      <ArticleDetail article={article} />
    </div>
  );
}
