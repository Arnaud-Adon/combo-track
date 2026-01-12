import { BookOpen } from "lucide-react";
import type { PublishedArticles } from "../../../../prisma/query/glossary.query";
import { ArticleCard } from "./glossary-article-card";

interface GlossaryListProps {
  articles: PublishedArticles;
  selectedCategory?: string | null;
}

export function GlossaryList({
  articles,
  selectedCategory,
}: GlossaryListProps) {
  const filteredArticles = selectedCategory
    ? articles.filter((article) => article.category === selectedCategory)
    : articles;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Glossaire</h2>

      {filteredArticles.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12" />
          <p>
            {selectedCategory
              ? "Aucun article dans cette catégorie."
              : "Aucun article disponible pour le moment."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
