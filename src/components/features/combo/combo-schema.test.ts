import { describe, it, expect } from "vitest";
import { comboFormSchema } from "./combo-schema";

describe("comboFormSchema", () => {
  it("should validate a minimal combo", () => {
    const result = comboFormSchema.safeParse({
      characterId: "char-1",
      title: "Drive Rush combo",
      notation: "5MP > 2HP xx 236P",
      tagIds: [],
    });
    expect(result.success).toBe(true);
  });

  it("should validate a complete combo", () => {
    const result = comboFormSchema.safeParse({
      characterId: "char-1",
      title: "Bread and butter",
      notation: "j.HK, 5MP, 2MP xx 214K, SA1",
      damage: 3500,
      meterUsed: 1,
      difficulty: 3,
      notes: "Hit confirm depuis le j.HK",
      tagIds: ["tag-1", "tag-2"],
      sourceNoteId: "note-1",
    });
    expect(result.success).toBe(true);
  });

  it("should accept numeric form values", () => {
    const result = comboFormSchema.safeParse({
      characterId: "char-1",
      title: "Test",
      notation: "X",
      damage: 1500,
      meterUsed: 2,
      difficulty: 4,
      tagIds: [],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.damage).toBe(1500);
      expect(result.data.meterUsed).toBe(2);
      expect(result.data.difficulty).toBe(4);
    }
  });

  it("should accept omitted optional fields", () => {
    const result = comboFormSchema.safeParse({
      characterId: "char-1",
      title: "Test",
      notation: "X",
      tagIds: [],
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty characterId", () => {
    const result = comboFormSchema.safeParse({
      characterId: "",
      title: "Test",
      notation: "X",
      tagIds: [],
    });
    expect(result.success).toBe(false);
  });

  it("should reject title shorter than 2 chars", () => {
    const result = comboFormSchema.safeParse({
      characterId: "char-1",
      title: "T",
      notation: "X",
      tagIds: [],
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty notation", () => {
    const result = comboFormSchema.safeParse({
      characterId: "char-1",
      title: "Test",
      notation: "",
      tagIds: [],
    });
    expect(result.success).toBe(false);
  });

  it("should reject damage out of range", () => {
    const result = comboFormSchema.safeParse({
      characterId: "char-1",
      title: "Test",
      notation: "X",
      damage: 10000,
      tagIds: [],
    });
    expect(result.success).toBe(false);
  });

  it("should reject meterUsed > 10", () => {
    const result = comboFormSchema.safeParse({
      characterId: "char-1",
      title: "Test",
      notation: "X",
      meterUsed: 15,
      tagIds: [],
    });
    expect(result.success).toBe(false);
  });

  it("should reject difficulty < 1 or > 5", () => {
    const r1 = comboFormSchema.safeParse({
      characterId: "char-1",
      title: "Test",
      notation: "X",
      difficulty: 0,
      tagIds: [],
    });
    const r2 = comboFormSchema.safeParse({
      characterId: "char-1",
      title: "Test",
      notation: "X",
      difficulty: 6,
      tagIds: [],
    });
    expect(r1.success).toBe(false);
    expect(r2.success).toBe(false);
  });

  it("should reject more than 10 tags", () => {
    const result = comboFormSchema.safeParse({
      characterId: "char-1",
      title: "Test",
      notation: "X",
      tagIds: Array.from({ length: 11 }, (_, i) => `tag-${i}`),
    });
    expect(result.success).toBe(false);
  });

  it("should reject notation over 500 chars", () => {
    const result = comboFormSchema.safeParse({
      characterId: "char-1",
      title: "Test",
      notation: "X".repeat(501),
      tagIds: [],
    });
    expect(result.success).toBe(false);
  });
});
