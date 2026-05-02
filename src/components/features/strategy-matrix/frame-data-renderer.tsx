import type { Components } from "react-markdown";
import type { ReactNode } from "react";
import { Fragment } from "react";

const FRAME_PATTERN = /(\([+-]\d{1,2}\)|\(0\))/g;

function highlightFrameData(children: ReactNode): ReactNode {
  if (typeof children === "string") {
    const parts = children.split(FRAME_PATTERN);
    if (parts.length === 1) return children;

    return parts.map((part, i) => {
      if (/^\(\+\d{1,2}\)$/.test(part)) {
        return (
          <span key={i} className="font-semibold text-blue-400">
            {part}
          </span>
        );
      }
      if (/^\(-\d{1,2}\)$/.test(part)) {
        return (
          <span key={i} className="font-semibold text-red-400">
            {part}
          </span>
        );
      }
      if (part === "(0)") {
        return (
          <span key={i} className="font-semibold text-yellow-400">
            {part}
          </span>
        );
      }
      return part;
    });
  }

  if (Array.isArray(children)) {
    return children.map((child, i) => (
      <Fragment key={i}>{highlightFrameData(child)}</Fragment>
    ));
  }

  return children;
}

export const frameDataComponents: Partial<Components> = {
  p: ({ children, ...props }) => (
    <p {...props}>{highlightFrameData(children)}</p>
  ),
  li: ({ children, ...props }) => (
    <li {...props}>{highlightFrameData(children)}</li>
  ),
  td: ({ children, ...props }) => (
    <td {...props}>{highlightFrameData(children)}</td>
  ),
  th: ({ children, ...props }) => (
    <th {...props}>{highlightFrameData(children)}</th>
  ),
};
