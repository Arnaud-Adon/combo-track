"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="prose prose-invert border-border bg-card text-accent-foreground max-w-none rounded-lg border p-4">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content || "*Aucun contenu à prévisualiser*"}
      </ReactMarkdown>
    </div>
  );
}
