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

describe("searchNotesSemantic", () => {
  it("returns empty array when embedding generation fails", async () => {
    generateEmbedding.mockResolvedValue(null);
    const { searchNotesSemantic } = await import("./search-notes");
    const result = await searchNotesSemantic("user-1", "query");
    expect(result).toEqual([]);
    expect(prismaMock.$queryRaw).not.toHaveBeenCalled();
  });

  it("maps similarity from distance and forwards rows", async () => {
    generateEmbedding.mockResolvedValue(fakeEmbedding());
    prismaMock.$queryRaw.mockResolvedValue([
      {
        id: "n1",
        matchId: "m1",
        matchTitle: "Ranked vs Ken",
        timestamp: 42,
        content: "punish DP",
        distance: 0.2,
      },
    ] as never);

    const { searchNotesSemantic } = await import("./search-notes");
    const result = await searchNotesSemantic("user-1", "anti DP");

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "n1",
      matchId: "m1",
      matchTitle: "Ranked vs Ken",
      timestamp: 42,
      content: "punish DP",
    });
    expect(result[0].similarity).toBeCloseTo(0.8, 5);
  });
});
