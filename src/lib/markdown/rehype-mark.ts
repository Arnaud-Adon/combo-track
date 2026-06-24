type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const MARK_PATTERN = /==(.+?)==/g;
const SKIP_TAGS = new Set(["code", "pre"]);

function splitTextNode(node: HastNode): HastNode[] | null {
  const value = node.value ?? "";
  if (!value.includes("==")) return null;

  MARK_PATTERN.lastIndex = 0;
  const segments: HastNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = MARK_PATTERN.exec(value)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        value: value.slice(lastIndex, match.index),
      });
    }
    segments.push({
      type: "element",
      tagName: "mark",
      properties: {},
      children: [{ type: "text", value: match[1] }],
    });
    lastIndex = match.index + match[0].length;
  }

  if (segments.length === 0) return null;
  if (lastIndex < value.length) {
    segments.push({ type: "text", value: value.slice(lastIndex) });
  }

  return segments;
}

function transform(node: HastNode): void {
  if (!node.children) return;
  if (node.tagName && SKIP_TAGS.has(node.tagName)) return;

  const next: HastNode[] = [];
  for (const child of node.children) {
    if (child.type === "text") {
      const split = splitTextNode(child);
      if (split) {
        next.push(...split);
        continue;
      }
    } else {
      transform(child);
    }
    next.push(child);
  }
  node.children = next;
}

export default function rehypeMark() {
  return (tree: HastNode) => {
    transform(tree);
  };
}
