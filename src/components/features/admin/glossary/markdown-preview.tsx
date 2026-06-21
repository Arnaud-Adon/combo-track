"use client";

import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { notationComponents } from "@/components/features/notation/notation-renderer";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const t = useTranslations("admin");

  return (
    <div className="prose prose-invert border-border bg-card text-accent-foreground max-w-none rounded-lg border p-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          ...notationComponents,
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={typeof src === "string" ? src : undefined}
              alt={alt ?? ""}
              className="border-border my-4 w-full rounded-lg border"
            />
          ),
        }}
      >
        {content || t("article.preview.empty")}
      </ReactMarkdown>
    </div>
  );
}
