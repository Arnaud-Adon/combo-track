"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ArticleDetail } from "../../../../prisma/query/glossary.query";
import { CategoryBadge } from "./glossary-category-badge";

interface ArticleDetailProps {
  article: NonNullable<ArticleDetail>;
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  return (
    <article className="space-y-6">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold">{article.title}</h1>

        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          {article.category && <CategoryBadge category={article.category} />}
          <time dateTime={article.createdAt.toString()}>
            Créé le {new Date(article.createdAt).toLocaleDateString()}
          </time>
          {article.updatedAt && (
            <time dateTime={article.updatedAt.toString()}>
              Mis à jour le {new Date(article.updatedAt).toLocaleDateString()}
            </time>
          )}
        </div>
      </header>

      <div className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {article.content}
        </ReactMarkdown>
      </div>

      <footer className="border-t border-zinc-800 pt-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={article.creator.image ?? undefined} />
            <AvatarFallback>
              {article.creator.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              Créé par {article.creator.name}
            </p>
            <p className="text-muted-foreground text-xs">
              {new Date(article.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </footer>
    </article>
  );
}
