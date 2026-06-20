import { frameDataComponents } from "@/components/features/strategy-matrix/frame-data-renderer";
import type { ReactNode } from "react";
import type { Components } from "react-markdown";
import { NotationChip } from "./notation-chip";
import { parseNotation } from "./notation-parser";

function childrenToString(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(childrenToString).join("");
  return "";
}

export const notationComponents: Partial<Components> = {
  ...frameDataComponents,
  code({ className, children }) {
    if (className && /language-/.test(className)) {
      return <code className={className}>{children}</code>;
    }

    const segments = parseNotation(childrenToString(children));
    const hasNotation = segments.some((segment) => segment.kind !== "text");

    if (!hasNotation) {
      return <code>{children}</code>;
    }

    return (
      <span className="font-mono">
        {segments.map((segment, index) => (
          <NotationChip key={index} segment={segment} />
        ))}
      </span>
    );
  },
};
