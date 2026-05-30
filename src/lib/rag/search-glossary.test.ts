import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import type { PrismaClient } from "../../../generated/prisma";
import { fakeEmbedding } from "../../../__mocks__/openai";

const prismaMock = mockDeep<PrismaClient>();

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
  Prisma: { raw: (s: string) => s },
}));

const generateEmbedding = vi.fn();
vi.mock("@/lib/ai/openai", () => ({
  generateEmbedding: (text: string) => generateEmbedding(text),
}));

beforeEach(() => {
  mockReset(prismaMock);
  generateEmbedding.mockReset();
});

describe("searchGlossarySemantic", () => {
  it("returns empty when embedding null", async () => {
    generateEmbedding.mockResolvedValue(null);
    const { searchGlossarySemantic } = await import("./search-glossary");
    const result = await searchGlossarySemantic("anti-air");
    expect(result).toEqual([]);
  });

  it("maps similarity from distance", async () => {
    generateEmbedding.mockResolvedValue(fakeEmbedding());
    prismaMock.$queryRaw.mockResolvedValue([
      {
        id: "a1",
        slug: "anti-air",
        title: "Anti-air",
        excerpt: "DP or jump",
        category: "Neutral",
        distance: 0.1,
      },
    ] as never);

    const { searchGlossarySemantic } = await import("./search-glossary");
    const result = await searchGlossarySemantic("how to anti air");
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("anti-air");
    expect(result[0].similarity).toBeCloseTo(0.9, 5);
  });
});
