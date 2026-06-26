import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import rehypeMark from "@/lib/markdown/rehype-mark";
import { cn } from "@/lib/utils";

import { notationComponents } from "./notation-renderer";

type Props = {
  children: string;
  className?: string;
  emptyFallback?: string;
  breaks?: boolean;
};

export function MarkdownPreview({
  children,
  className,
  emptyFallback,
  breaks = false,
}: Props) {
  return (
    <div
      className={cn(
        "prose prose-invert text-foreground max-w-none text-sm",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={breaks ? [remarkGfm, remarkBreaks] : [remarkGfm]}
        rehypePlugins={[rehypeMark]}
        components={notationComponents}
      >
        {children || emptyFallback || ""}
      </ReactMarkdown>
    </div>
  );
}
