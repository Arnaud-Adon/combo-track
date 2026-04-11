import { env } from "@/lib/env";
import OpenAI from "openai";
import { z } from "zod";

export type MatchReportData = {
  summary: string;
  strengths: string[];
  weakness: string;
  keyMoments: Array<{ timestamp: number; description: string }>;
  recommendations: string[];
};

const matchReportSchema = z.object({
  summary: z.string(),
  strengths: z.array(z.string()).min(2).max(3),
  weakness: z.string(),
  keyMoments: z
    .array(z.object({ timestamp: z.number(), description: z.string() }))
    .min(1)
    .max(5),
  recommendations: z.array(z.string()).min(2).max(3),
});

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

export async function generateMatchReport(
  notes: Array<{ timestamp: number; content: string; tags: string[] }>,
  matchTitle: string,
): Promise<MatchReportData | null> {
  if (!groqClient) {
    return null;
  }

  const formattedNotes = notes
    .map(
      (n) =>
        `[${Math.floor(n.timestamp / 60)}:${String(n.timestamp % 60).padStart(2, "0")}] ${n.content}${n.tags.length > 0 ? ` (tags: ${n.tags.join(", ")})` : ""}`,
    )
    .join("\n");

  try {
    const response = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Tu es un coach de jeux de combat spécialisé dans Street Fighter 6. On te fournit des notes horodatées prises pendant un match. Analyse-les et produis un rapport structuré en JSON avec exactement ces champs :

- "summary" (string) : résumé court du match en 2-3 phrases
- "strengths" (array de 2-3 strings) : points forts démontrés par le joueur
- "weakness" (string) : UN SEUL point faible prioritaire à travailler
- "keyMoments" (array de 3-5 objets {timestamp: number, description: string}) : moments clés du match. Les timestamps sont en secondes.
- "recommendations" (array de 2-3 strings) : exercices concrets pour progresser

Sois spécifique aux notes fournies, pas générique. Utilise le vocabulaire FGC (frame data, neutral, whiff punish, oki, etc.). Réponds uniquement en français.`,
        },
        {
          role: "user",
          content: `Match : "${matchTitle}"\n\nNotes :\n${formattedNotes}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return null;
    }

    const parsed = matchReportSchema.parse(JSON.parse(content));
    return parsed;
  } catch {
    return null;
  }
}
