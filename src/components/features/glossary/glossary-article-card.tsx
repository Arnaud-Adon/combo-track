import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { PublishedArticles } from "../../../../prisma/query/glossary.query";
import { CategoryBadge } from "./glossary-category-badge";

interface ArticleCardProps {
  article: PublishedArticles[number];
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export async function ArticleCard({ article }: ArticleCardProps) {
  const t = await getTranslations("glossary");

  return (
    <Link
      href={`/glossary/${article.slug}`}
      className="group block focus:outline-none"
    >
      <article className="bg-card border-border hover:border-primary/60 focus-visible:border-primary/60 hover:shadow-primary/25 relative flex h-full flex-col overflow-hidden rounded-lg border transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_40px_-15px]">
        {/* Cover — article image when present, otherwise category watermark. */}
        <div className="bg-muted border-border relative aspect-[16/9] w-full overflow-hidden border-b">
          {article.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.image}
              alt={article.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            article.category && (
              <span className="font-display text-foreground/[0.05] absolute inset-0 flex items-center justify-center px-4 text-center text-4xl tracking-tight uppercase select-none">
                {article.category}
              </span>
            )
          )}

          {/* FGC corner ticks */}
          <span className="border-primary/40 absolute top-2 left-2 h-3 w-3 border-t border-l" />
          <span className="border-primary/40 absolute top-2 right-2 h-3 w-3 border-t border-r" />
          <span className="border-primary/40 absolute bottom-2 left-2 h-3 w-3 border-b border-l" />
          <span className="border-primary/40 absolute right-2 bottom-2 h-3 w-3 border-r border-b" />

          {article.category && (
            <div className="absolute top-3 left-3">
              <CategoryBadge category={article.category} />
            </div>
          )}
          <span className="text-muted-foreground absolute right-3 bottom-3 font-mono text-[11px] tabular-nums">
            {formatDate(article.createdAt)}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <h3 className="font-display text-foreground group-hover:text-primary text-base leading-tight tracking-tight uppercase transition-colors">
            {article.title}
          </h3>
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
            {article.excerpt ?? t("card.noDescription")}
          </p>
          <div className="border-border mt-auto flex items-center justify-between border-t pt-3">
            <span className="text-muted-foreground font-mono text-[11px]">
              {t("card.author", { name: article.creator.name })}
            </span>
            <span className="text-primary inline-flex translate-x-1 items-center gap-1 text-xs font-medium opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
              {t("card.read")} <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
