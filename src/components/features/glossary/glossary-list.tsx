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
    <section className="space-y-8">
      <header className="border-border space-y-3 border-b pb-6">
        <p className="font-display text-primary text-xs tracking-[0.2em] uppercase">
          FGC // Base de connaissances
        </p>
        <div className="flex items-end justify-between gap-4">
          <h1 className="font-display text-foreground text-4xl tracking-tight uppercase">
            Glossaire
          </h1>
          <span className="text-muted-foreground font-mono text-sm tabular-nums">
            {filteredArticles.length.toString().padStart(2, "0")} entrées
          </span>
        </div>
      </header>

      {filteredArticles.length === 0 ? (
        <div className="border-border text-muted-foreground flex flex-col items-center rounded-lg border border-dashed py-16 text-center">
          <BookOpen className="mb-4 h-10 w-10 opacity-50" />
          <p className="font-mono text-sm">
            {selectedCategory
              ? "Aucun article dans cette catégorie."
              : "Aucun article disponible pour le moment."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}
