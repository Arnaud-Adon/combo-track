import { env } from "@/lib/env";
import OpenAI from "openai";

export const EMBEDDING_MODEL = "text-embedding-3-small";
export const EMBEDDING_DIMENSIONS = 1536;
const MAX_INPUT_CHARS = 8000;
const BATCH_SIZE = 100;

const openaiClient = env.OPEN_AI_API_KEY
  ? new OpenAI({ apiKey: env.OPEN_AI_API_KEY })
  : null;

function truncate(text: string): string {
  return text.length > MAX_INPUT_CHARS ? text.slice(0, MAX_INPUT_CHARS) : text;
}

export async function generateEmbedding(
  text: string,
): Promise<number[] | null> {
  if (!openaiClient) {
    return null;
  }

  const input = truncate(text);
  if (input.trim().length === 0) {
    return null;
  }

  try {
    const response = await openaiClient.embeddings.create({
      model: EMBEDDING_MODEL,
      input,
      encoding_format: "float",
    });

    return response.data[0]?.embedding ?? null;
  } catch {
    return null;
  }
}

export async function generateEmbeddingsBatch(
  texts: string[],
): Promise<(number[] | null)[]> {
  if (!openaiClient || texts.length === 0) {
    return texts.map(() => null);
  }

  const results: (number[] | null)[] = new Array(texts.length).fill(null);

  for (let start = 0; start < texts.length; start += BATCH_SIZE) {
    const end = Math.min(start + BATCH_SIZE, texts.length);
    const chunk = texts.slice(start, end).map(truncate);

    try {
      const response = await openaiClient.embeddings.create({
        model: EMBEDDING_MODEL,
        input: chunk,
        encoding_format: "float",
      });

      for (const item of response.data) {
        results[start + item.index] = item.embedding;
      }
    } catch {
      // leave nulls for failed batch
    }
  }

  return results;
}
