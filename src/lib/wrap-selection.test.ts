import { describe, expect, it } from "vitest";
import { prefixLines, replaceSelection, wrapSelection } from "./wrap-selection";

describe("wrapSelection", () => {
  it("wraps the current selection with the markers", () => {
    expect(wrapSelection("abc", 0, 3, "**", "**")).toEqual({
      value: "**abc**",
      selectionStart: 2,
      selectionEnd: 5,
    });
  });

  it("inserts empty markers and places the cursor between them when nothing is selected", () => {
    expect(wrapSelection("", 0, 0, "**", "**")).toEqual({
      value: "****",
      selectionStart: 2,
      selectionEnd: 2,
    });
  });

  it("wraps only the selected slice in the middle of the text", () => {
    expect(wrapSelection("a word here", 2, 6, "_", "_")).toEqual({
      value: "a _word_ here",
      selectionStart: 3,
      selectionEnd: 7,
    });
  });

  it("clamps the result to maxLength", () => {
    const { value } = wrapSelection("abcdef", 0, 6, "**", "**", {
      maxLength: 8,
    });
    expect(value.length).toBe(8);
  });
});

describe("replaceSelection", () => {
  it("replaces the selection and puts the cursor after the replacement", () => {
    expect(replaceSelection("see here", 4, 8, "[here](https://x.io)")).toEqual({
      value: "see [here](https://x.io)",
      selectionStart: 24,
      selectionEnd: 24,
    });
  });
});

describe("prefixLines", () => {
  it("prefixes a single line", () => {
    expect(prefixLines("title", 0, 0, "# ")).toEqual({
      value: "# title",
      selectionStart: 0,
      selectionEnd: 7,
    });
  });

  it("prefixes every line covered by the selection", () => {
    expect(prefixLines("a\nb\nc", 0, 5, "- ")).toEqual({
      value: "- a\n- b\n- c",
      selectionStart: 0,
      selectionEnd: 11,
    });
  });

  it("supports an index-based prefix for ordered lists", () => {
    expect(prefixLines("a\nb", 0, 3, (index) => `${index + 1}. `)).toEqual({
      value: "1. a\n2. b",
      selectionStart: 0,
      selectionEnd: 9,
    });
  });

  it("only prefixes the line the cursor sits on", () => {
    expect(prefixLines("first\nsecond", 7, 7, "> ")).toEqual({
      value: "first\n> second",
      selectionStart: 6,
      selectionEnd: 14,
    });
  });
});
