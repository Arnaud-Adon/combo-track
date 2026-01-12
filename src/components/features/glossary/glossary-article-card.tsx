import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import type { PublishedArticles } from "../../../../prisma/query/glossary.query";
import { CategoryBadge } from "./glossary-category-badge";

interface ArticleCardProps {
  article: PublishedArticles[number];
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/glossary/${article.slug}`}>
      <Card className="text-muted-foreground cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900/50 px-1 py-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              {article.category && (
                <CategoryBadge category={article.category} />
              )}
              <span className="text-foreground text-lg">{article.title}</span>
            </div>
            <div className="text-sm font-light">
              {new Date(article.createdAt).toLocaleDateString()}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {article.excerpt ? (
            <p className="text-muted-foreground text-sm">{article.excerpt}</p>
          ) : (
            <p className="text-muted-foreground text-sm italic">
              Aucune description disponible
            </p>
          )}
          <p className="text-muted-foreground text-xs">
            Par {article.creator.name}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
