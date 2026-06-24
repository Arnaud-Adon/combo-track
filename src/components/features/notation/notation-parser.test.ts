import { describe, expect, it } from "vitest";
import { numpadToGlyphs, parseNotation } from "./notation-parser";

describe("numpadToGlyphs", () => {
  it("maps a quarter-circle-forward motion to arrow glyphs", () => {
    expect(numpadToGlyphs("236")).toBe("↓↘→");
  });

  it("returns null when a digit is not directional (contains 0)", () => {
    expect(numpadToGlyphs("360")).toBeNull();
  });

  it("keeps charge brackets around the directional glyphs", () => {
    expect(numpadToGlyphs("[4]6")).toBe("[←]→");
    expect(numpadToGlyphs("[2]8")).toBe("[↓]↑");
  });
});

describe("parseNotation", () => {
  it("recognizes intensity buttons with the right color tier", () => {
    expect(parseNotation("HP")).toEqual([
      { kind: "button", raw: "HP", intensity: "heavy" },
    ]);
    expect(parseNotation("LP")).toEqual([
      { kind: "button", raw: "LP", intensity: "light" },
    ]);
    expect(parseNotation("MK")).toEqual([
      { kind: "button", raw: "MK", intensity: "medium" },
    ]);
  });

  it("renders a generic button as a neutral chip", () => {
    expect(parseNotation("236K")).toEqual([
      {
        kind: "motion",
        raw: "236",
        glyphs: "↓↘→",
        label: expect.stringContaining("QCF"),
      },
      { kind: "button", raw: "K", intensity: "neutral" },
    ]);
  });

  it("attaches glyphs and a label to a known motion", () => {
    const [motion] = parseNotation("236");
    expect(motion).toMatchObject({
      kind: "motion",
      raw: "236",
      glyphs: "↓↘→",
    });
    expect(motion).toHaveProperty("label", expect.stringContaining("avant"));
  });

  it("prefers the longest known motion (41236 over 236)", () => {
    expect(parseNotation("41236P")).toEqual([
      {
        kind: "motion",
        raw: "41236",
        glyphs: "←↙↓↘→",
        label: expect.stringContaining("HCF"),
      },
      { kind: "button", raw: "P", intensity: "neutral" },
    ]);
  });

  it("combines a motion and a button (236HP)", () => {
    expect(parseNotation("236HP")).toEqual([
      {
        kind: "motion",
        raw: "236",
        glyphs: "↓↘→",
        label: expect.stringContaining("QCF"),
      },
      { kind: "button", raw: "HP", intensity: "heavy" },
    ]);
  });

  it("colors frame data inside the code and does not treat +8 as a motion", () => {
    const segments = parseNotation("HP (+8)");
    expect(segments).toContainEqual({
      kind: "frame",
      raw: "(+8)",
      tone: "positive",
    });
    expect(segments.some((s) => s.kind === "motion")).toBe(false);
  });

  it("does not mistake a super art (SA1) for a motion", () => {
    const segments = parseNotation("SA1");
    expect(segments.some((s) => s.kind === "motion")).toBe(false);
  });

  it("keeps plain notation operators and positions as text", () => {
    expect(parseNotation("cr. xx >")).toEqual([
      { kind: "text", raw: "cr. xx >" },
    ]);
  });

  it("renders a motion with a 0 as raw text with its label", () => {
    expect(parseNotation("360P")).toEqual([
      {
        kind: "motion",
        raw: "360",
        glyphs: null,
        label: expect.stringContaining("SPD"),
      },
      { kind: "button", raw: "P", intensity: "neutral" },
    ]);
  });

  it("does not match a single button letter inside a word", () => {
    expect(parseNotation("Punch")).toEqual([{ kind: "text", raw: "Punch" }]);
  });

  it("recognizes a charge motion with brackets ([4]6P)", () => {
    expect(parseNotation("[4]6P")).toEqual([
      {
        kind: "motion",
        raw: "[4]6",
        glyphs: "[←]→",
        label: expect.stringContaining("Charge"),
      },
      { kind: "button", raw: "P", intensity: "neutral" },
    ]);
  });
});
