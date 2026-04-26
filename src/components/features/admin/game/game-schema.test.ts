import { describe, it, expect } from "vitest";
import { gameFormSchema } from "./game-schema";

describe("gameFormSchema", () => {
  it("should validate correct game data", () => {
    const result = gameFormSchema.safeParse({
      name: "Street Fighter 6",
      slug: "street-fighter-6",
      iconUrl: "https://example.com/icon.png",
    });
    expect(result.success).toBe(true);
  });

  it("should accept empty iconUrl", () => {
    const result = gameFormSchema.safeParse({
      name: "Tekken 8",
      slug: "tekken-8",
      iconUrl: "",
    });
    expect(result.success).toBe(true);
  });

  it("should accept omitted iconUrl", () => {
    const result = gameFormSchema.safeParse({
      name: "Tekken 8",
      slug: "tekken-8",
    });
    expect(result.success).toBe(true);
  });

  it("should reject name shorter than 2 characters", () => {
    const result = gameFormSchema.safeParse({
      name: "S",
      slug: "sf",
    });
    expect(result.success).toBe(false);
  });

  it("should reject slug with uppercase letters", () => {
    const result = gameFormSchema.safeParse({
      name: "Street Fighter 6",
      slug: "Street-Fighter-6",
    });
    expect(result.success).toBe(false);
  });

  it("should reject slug with spaces", () => {
    const result = gameFormSchema.safeParse({
      name: "Street Fighter 6",
      slug: "street fighter 6",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid iconUrl", () => {
    const result = gameFormSchema.safeParse({
      name: "SF6",
      slug: "sf6",
      iconUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("should reject name over 80 characters", () => {
    const result = gameFormSchema.safeParse({
      name: "a".repeat(81),
      slug: "sf6",
    });
    expect(result.success).toBe(false);
  });

  it("should reject slug over 40 characters", () => {
    const result = gameFormSchema.safeParse({
      name: "Game",
      slug: "a".repeat(41),
    });
    expect(result.success).toBe(false);
  });
});
