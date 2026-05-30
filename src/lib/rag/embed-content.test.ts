import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import type { PrismaClient } from "../../../generated/prisma";
import { fakeEmbedding } from "../../../__mocks__/openai";
import { hashContent } from "./content-hash";

const prismaMock = mockDeep<PrismaClient>();

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
  Prisma: { raw: (s: string) => s },
}));

const generateEmbedding = vi.fn();
vi.mock("@/lib/ai/openai", () => ({
  EMBEDDING_MODEL: "text-embedding-3-small",
  generateEmbedding: (text: string) => generateEmbedding(text),
}));

beforeEach(() => {
  mockReset(prismaMock);
  generateEmbedding.mockReset();
});

describe("embedNoteIfNeeded", () => {
  it("skips when content hash and model unchanged", async () => {
    const content = "hello world";
    prismaMock.note.findUnique.mockResolvedValue({
      contentHash: hashContent(content),
      embeddingModel: "text-embedding-3-small",
    } as never);
    const { embedNoteIfNeeded } = await import("./embed-content");
    await embedNoteIfNeeded("note-1", content);
    expect(generateEmbedding).not.toHaveBeenCalled();
    expect(prismaMock.$executeRaw).not.toHaveBeenCalled();
  });

  it("updates embedding when hash differs", async () => {
    prismaMock.note.findUnique.mockResolvedValue({
      contentHash: "old-hash",
      embeddingModel: "text-embedding-3-small",
    } as never);
    generateEmbedding.mockResolvedValue(fakeEmbedding());
    prismaMock.$executeRaw.mockResolvedValue(1);
    const { embedNoteIfNeeded } = await import("./embed-content");
    await embedNoteIfNeeded("note-1", "new content");
    expect(generateEmbedding).toHaveBeenCalledWith("new content");
    expect(prismaMock.$executeRaw).toHaveBeenCalledOnce();
  });

  it("silently exits when embedding returns null", async () => {
    prismaMock.note.findUnique.mockResolvedValue(null);
    generateEmbedding.mockResolvedValue(null);
    const { embedNoteIfNeeded } = await import("./embed-content");
    await embedNoteIfNeeded("note-1", "content");
    expect(prismaMock.$executeRaw).not.toHaveBeenCalled();
  });
});

describe("embedGlossaryArticleIfNeeded", () => {
  it("composes title and content for embedding", async () => {
    prismaMock.glossaryArticle.findUnique.mockResolvedValue(null);
    generateEmbedding.mockResolvedValue(fakeEmbedding());
    prismaMock.$executeRaw.mockResolvedValue(1);
    const { embedGlossaryArticleIfNeeded } = await import("./embed-content");
    await embedGlossaryArticleIfNeeded("a-1", "Shoryuken", "DP motion");
    expect(generateEmbedding).toHaveBeenCalledWith("Shoryuken\n\nDP motion");
  });
});
