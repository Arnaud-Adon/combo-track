import { describe, it, expect } from "vitest";
import { noteSchema } from "./note-schema";

describe("noteSchema", () => {
  it("should validate correct note data", () => {
    const validData = {
      note: "Valid note content",
      tagIds: ["tag1", "tag2"],
    };
    const result = noteSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject note content less than 2 characters", () => {
    const invalidData = {
      note: "a",
      tagIds: ["tag1"],
    };
    const result = noteSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject empty tagIds array", () => {
    const invalidData = {
      note: "Valid note content",
      tagIds: [],
    };
    const result = noteSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject more than 10 tags", () => {
    const invalidData = {
      note: "Valid note content",
      tagIds: Array(11).fill("tag"),
    };
    const result = noteSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should allow exactly 10 tags", () => {
    const validData = {
      note: "Valid note content",
      tagIds: Array(10).fill("tag"),
    };
    const result = noteSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
