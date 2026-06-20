import { describe, expect, it } from "vitest";
import { insertNotationToken } from "./insert-notation";

describe("insertNotationToken", () => {
  it("wraps the token in backticks when inserting into prose", () => {
    expect(insertNotationToken("", 0, 0, "236", { maxLength: 2000 })).toEqual({
      value: "`236`",
      cursor: 4,
    });
  });

  it("places the cursor inside the new zone (before the closing backtick)", () => {
    const { value, cursor } = insertNotationToken("", 0, 0, "HP", {
      maxLength: 2000,
    });
    expect(value).toBe("`HP`");
    expect(value[cursor]).toBe("`");
  });

  it("extends the current zone without adding backticks when already inside", () => {
    expect(
      insertNotationToken("`cr.`", 4, 4, "HP", { maxLength: 2000 }),
    ).toEqual({
      value: "`cr.HP`",
      cursor: 6,
    });
  });

  it("keeps the cursor between the parentheses for frame tokens", () => {
    expect(
      insertNotationToken("", 0, 0, "(+)", {
        cursorOffset: 2,
        maxLength: 2000,
      }),
    ).toEqual({
      value: "`(+)`",
      cursor: 3,
    });
  });

  it("replaces the current selection", () => {
    expect(
      insertNotationToken("abXYcd", 2, 4, "HP", { maxLength: 2000 }),
    ).toEqual({
      value: "ab`HP`cd",
      cursor: 5,
    });
  });

  it("starts a fresh zone when a closed combo already exists earlier on the line", () => {
    expect(
      insertNotationToken("`cr.HP` ", 8, 8, "236", { maxLength: 2000 }),
    ).toEqual({
      value: "`cr.HP` `236`",
      cursor: 12,
    });
  });

  it("clamps the result to maxLength", () => {
    const { value } = insertNotationToken("", 0, 0, "236", { maxLength: 3 });
    expect(value.length).toBe(3);
  });

  it("closes the zone with a trailing space outside the backtick in prose", () => {
    expect(
      insertNotationToken("", 0, 0, "HP", {
        closeZone: true,
        maxLength: 2000,
      }),
    ).toEqual({
      value: "`HP` ",
      cursor: 5,
    });
  });

  it("closes the current zone and adds a trailing space when inside", () => {
    expect(
      insertNotationToken("`cr.`", 4, 4, "HP", {
        closeZone: true,
        maxLength: 2000,
      }),
    ).toEqual({
      value: "`cr.HP` ",
      cursor: 8,
    });
  });
});
