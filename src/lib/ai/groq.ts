import { env } from "@/lib/env";
import OpenAI from "openai";

const groqClient = env.GROQ_API_KEY
  ? new OpenAI({
      apiKey: env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    })
  : null;

export async function suggestTagsFromNote(
  noteText: string,
  availableTagNames: string[],
): Promise<string[]> {
  if (!groqClient) {
    return [];
  }

  try {
    const response = await groqClient.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a fighting game tagging assistant. Given a note about a fighting game match, suggest 1 to 3 tags from the provided list that best describe the note. Reply with valid JSON only in the format: {"tags": ["Tag1", "Tag2"]}. Only use tags from the provided list. Never invent new tags.`,
        },
        {
          role: "user",
          content: `Available tags: ${availableTagNames.join(", ")}\n\nNote: "${noteText}"`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 100,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return [];
    }

    const parsed = JSON.parse(content) as { tags?: string[] };
    if (!Array.isArray(parsed.tags)) {
      return [];
    }

    return parsed.tags.filter((tag) => availableTagNames.includes(tag));
  } catch {
    return [];
  }
}
