import { describe, it, expect } from "vitest";
import { characterFormSchema } from "./character-schema";

describe("characterFormSchema", () => {
  it("should validate correct character data", () => {
    const result = characterFormSchema.safeParse({
      gameId: "game-id-123",
      name: "Ryu",
      slug: "ryu",
      iconUrl: "https://example.com/ryu.png",
    });
    expect(result.success).toBe(true);
  });

  it("should accept empty iconUrl", () => {
    const result = characterFormSchema.safeParse({
      gameId: "game-id-123",
      name: "Ken",
      slug: "ken",
      iconUrl: "",
    });
    expect(result.success).toBe(true);
  });

  it("should accept omitted iconUrl", () => {
    const result = characterFormSchema.safeParse({
      gameId: "game-id-123",
      name: "Chun-Li",
      slug: "chun-li",
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty gameId", () => {
    const result = characterFormSchema.safeParse({
      gameId: "",
      name: "Ryu",
      slug: "ryu",
    });
    expect(result.success).toBe(false);
  });

  it("should reject name shorter than 2 characters", () => {
    const result = characterFormSchema.safeParse({
      gameId: "game-id-123",
      name: "R",
      slug: "ryu",
    });
    expect(result.success).toBe(false);
  });

  it("should reject slug with uppercase letters", () => {
    const result = characterFormSchema.safeParse({
      gameId: "game-id-123",
      name: "Ryu",
      slug: "Ryu",
    });
    expect(result.success).toBe(false);
  });

  it("should reject slug with spaces", () => {
    const result = characterFormSchema.safeParse({
      gameId: "game-id-123",
      name: "Chun Li",
      slug: "chun li",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid iconUrl", () => {
    const result = characterFormSchema.safeParse({
      gameId: "game-id-123",
      name: "Ryu",
      slug: "ryu",
      iconUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("should reject name over 60 characters", () => {
    const result = characterFormSchema.safeParse({
      gameId: "game-id-123",
      name: "a".repeat(61),
      slug: "ryu",
    });
    expect(result.success).toBe(false);
  });

  it("should reject slug over 40 characters", () => {
    const result = characterFormSchema.safeParse({
      gameId: "game-id-123",
      name: "Ryu",
      slug: "a".repeat(41),
    });
    expect(result.success).toBe(false);
  });
});
