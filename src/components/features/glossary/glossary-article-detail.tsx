"use client";

import { renderInlineNotation } from "@/components/features/notation/notation-renderer";
import { highlightFrameData } from "@/components/features/strategy-matrix/frame-data-renderer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ArticleDetail } from "../../../../prisma/query/glossary.query";
import { CategoryBadge } from "./glossary-category-badge";

interface ArticleDetailProps {
  article: NonNullable<ArticleDetail>;
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  const t = useTranslations("glossary");

  return (
    <article className="space-y-6">
      {article.image && (
        <div className="bg-muted border-border relative aspect-[16/9] w-full overflow-hidden rounded-lg border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image}
            alt={article.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      )}

      <header className="space-y-4">
        <h1 className="text-4xl font-bold">{article.title}</h1>

        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          {article.category && <CategoryBadge category={article.category} />}
          <time dateTime={article.createdAt.toString()}>
            {t("detail.createdAt", {
              date: new Date(article.createdAt).toLocaleDateString(),
            })}
          </time>
          {article.updatedAt && (
            <time dateTime={article.updatedAt.toString()}>
              {t("detail.updatedAt", {
                date: new Date(article.updatedAt).toLocaleDateString(),
              })}
            </time>
          )}
        </div>
      </header>

      <div className="max-w-none text-[15px] leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="mt-8 mb-4 text-2xl font-bold first:mt-0">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="mt-8 mb-3 text-2xl font-bold first:mt-0">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="mt-6 mb-2 text-xl font-semibold">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="mb-4 leading-relaxed">
                {highlightFrameData(children)}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="mb-4 list-disc space-y-2 pl-6">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-4 list-decimal space-y-2 pl-6">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">
                {highlightFrameData(children)}
              </li>
            ),
            a: ({ href, children }) => (
              <a href={href} className="text-primary underline">
                {children}
              </a>
            ),
            strong: ({ children }) => (
              <strong className="text-foreground font-semibold">
                {children}
              </strong>
            ),
            code: ({ className, children }) =>
              className && /language-/.test(className) ? (
                <code className={className}>{children}</code>
              ) : (
                renderInlineNotation(
                  children,
                  "bg-muted rounded px-1.5 py-0.5 font-mono text-sm",
                )
              ),
            blockquote: ({ children }) => (
              <blockquote className="border-border text-muted-foreground my-4 border-l-2 pl-4 italic">
                {children}
              </blockquote>
            ),
            img: ({ src, alt }) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={typeof src === "string" ? src : undefined}
                alt={alt ?? ""}
                className="border-border my-6 w-full rounded-lg border"
              />
            ),
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>

      <footer className="border-border border-t pt-6">
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
              {t("detail.createdBy", { name: article.creator.name })}
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
