import { describe, expect, it } from "vitest";
import rehypeMark from "./rehype-mark";

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function paragraph(...children: HastNode[]): HastNode {
  return {
    type: "root",
    children: [{ type: "element", tagName: "p", properties: {}, children }],
  };
}

function run(tree: HastNode): HastNode {
  rehypeMark()(tree);
  return tree;
}

describe("rehypeMark", () => {
  it("turns ==text== into a <mark> element", () => {
    const tree = run(paragraph({ type: "text", value: "a ==b== c" }));
    const children = tree.children![0].children!;
    expect(children).toEqual([
      { type: "text", value: "a " },
      {
        type: "element",
        tagName: "mark",
        properties: {},
        children: [{ type: "text", value: "b" }],
      },
      { type: "text", value: " c" },
    ]);
  });

  it("handles multiple highlights in one text node", () => {
    const tree = run(paragraph({ type: "text", value: "==x== and ==y==" }));
    const marks = tree.children![0].children!.filter(
      (n) => n.tagName === "mark",
    );
    expect(marks).toHaveLength(2);
  });

  it("leaves plain text untouched", () => {
    const tree = run(paragraph({ type: "text", value: "no markers here" }));
    expect(tree.children![0].children).toEqual([
      { type: "text", value: "no markers here" },
    ]);
  });

  it("does not transform inside code or pre", () => {
    const tree = run({
      type: "root",
      children: [
        {
          type: "element",
          tagName: "code",
          properties: {},
          children: [{ type: "text", value: "==x==" }],
        },
      ],
    });
    expect(tree.children![0].children).toEqual([
      { type: "text", value: "==x==" },
    ]);
  });
});
