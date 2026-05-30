import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createOpenAIMock, fakeEmbedding } from "../../../__mocks__/openai";

vi.mock("@/lib/env", () => ({
  env: { OPEN_AI_API_KEY: "test-key" },
}));

const { ClassMock, create } = createOpenAIMock();

vi.mock("openai", () => ({
  default: ClassMock,
}));

describe("generateEmbedding", () => {
  beforeEach(() => {
    create.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns 1536-dim vector for valid input", async () => {
    const { generateEmbedding } = await import("./openai");
    const result = await generateEmbedding("hello world");
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1536);
  });

  it("returns null for empty input", async () => {
    const { generateEmbedding } = await import("./openai");
    const result = await generateEmbedding("   ");
    expect(result).toBeNull();
    expect(create).not.toHaveBeenCalled();
  });

  it("truncates input over 8000 chars", async () => {
    const { generateEmbedding } = await import("./openai");
    const longInput = "x".repeat(10000);
    await generateEmbedding(longInput);
    const callArg = create.mock.calls[0]?.[0] as { input: string };
    expect(callArg.input).toHaveLength(8000);
  });
});

describe("generateEmbedding error handling", () => {
  it("returns null when openai throws", async () => {
    vi.resetModules();
    const { ClassMock: errClass } = createOpenAIMock({ throwError: true });
    vi.doMock("openai", () => ({ default: errClass }));
    const mod = await import("./openai");
    const result = await mod.generateEmbedding("hello");
    expect(result).toBeNull();
    vi.doUnmock("openai");
  });
});

describe("generateEmbeddingsBatch", () => {
  it("returns empty array for empty input", async () => {
    vi.resetModules();
    const { ClassMock: cls } = createOpenAIMock();
    vi.doMock("openai", () => ({ default: cls }));
    const { generateEmbeddingsBatch } = await import("./openai");
    const result = await generateEmbeddingsBatch([]);
    expect(result).toEqual([]);
  });

  it("returns array aligned with input", async () => {
    vi.resetModules();
    const { ClassMock: cls } = createOpenAIMock();
    vi.doMock("openai", () => ({ default: cls }));
    const { generateEmbeddingsBatch } = await import("./openai");
    const result = await generateEmbeddingsBatch(["a", "b", "c"]);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual(fakeEmbedding(0));
    expect(result[1]).toEqual(fakeEmbedding(1));
    expect(result[2]).toEqual(fakeEmbedding(2));
  });
});

describe("generateEmbedding null client", () => {
  it("returns null when OPEN_AI_API_KEY is missing", async () => {
    vi.resetModules();
    vi.doMock("@/lib/env", () => ({ env: { OPEN_AI_API_KEY: undefined } }));
    const { generateEmbedding } = await import("./openai");
    const result = await generateEmbedding("hello");
    expect(result).toBeNull();
    vi.doUnmock("@/lib/env");
  });
});
