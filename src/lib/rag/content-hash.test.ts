import { describe, expect, it } from "vitest";
import { hashContent } from "./content-hash";

describe("hashContent", () => {
  it("returns deterministic sha256 hex digest", () => {
    const a = hashContent("hello");
    const b = hashContent("hello");
    expect(a).toBe(b);
    expect(a).toMatch(/^[a-f0-9]{64}$/);
  });

  it("returns different hash for different content", () => {
    expect(hashContent("foo")).not.toBe(hashContent("bar"));
  });

  it("is whitespace sensitive", () => {
    expect(hashContent("hello")).not.toBe(hashContent("hello "));
  });
});
