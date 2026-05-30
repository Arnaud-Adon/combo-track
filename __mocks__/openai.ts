import { vi } from "vitest";

export function fakeEmbedding(seed = 0, dims = 1536): number[] {
  return Array.from({ length: dims }, (_, i) => (i + seed) / dims);
}

export type OpenAIMockOptions = {
  throwError?: boolean;
  customResponse?: (input: string | string[]) => Array<{
    embedding: number[];
    index: number;
  }>;
};

export function createOpenAIMock(opts: OpenAIMockOptions = {}) {
  const create = vi.fn(async ({ input }: { input: string | string[] }) => {
    if (opts.throwError) {
      throw new Error("openai mock error");
    }
    const inputs = Array.isArray(input) ? input : [input];
    const data = opts.customResponse
      ? opts.customResponse(input)
      : inputs.map((_, i) => ({ embedding: fakeEmbedding(i), index: i }));
    return {
      data,
      usage: { prompt_tokens: 10, total_tokens: 10 },
      model: "text-embedding-3-small",
      object: "list" as const,
    };
  });

  const ClassMock = vi.fn().mockImplementation(() => ({
    embeddings: { create },
  }));

  return { ClassMock, create };
}
