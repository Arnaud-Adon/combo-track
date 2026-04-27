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

export type MatrixAxisInput = {
  label: string;
  resource: string;
  levels: Array<{ id: string; label: string }>;
};

export type MatrixCellOutput = {
  myLevelId: string;
  opponentLevelId: string;
  content: string;
};

const matrixCellsSchema = z.object({
  cells: z.array(
    z.object({
      myLevelId: z.string(),
      opponentLevelId: z.string(),
      content: z.string().max(2000),
    }),
  ),
});

export async function generateStrategyMatrixCells(input: {
  title: string;
  description?: string;
  gameName?: string;
  myCharacterName?: string;
  opponentCharacterName?: string;
  myAxis: MatrixAxisInput;
  opponentAxis: MatrixAxisInput;
}): Promise<MatrixCellOutput[] | null> {
  if (!groqClient) {
    return null;
  }

  const matchupContext = [
    input.gameName && `Jeu : ${input.gameName}`,
    input.myCharacterName && `Mon perso : ${input.myCharacterName}`,
    input.opponentCharacterName && `Adversaire : ${input.opponentCharacterName}`,
  ]
    .filter(Boolean)
    .join(" | ");

  const myLevels = input.myAxis.levels
    .map((l) => `${l.id} (${l.label})`)
    .join(", ");
  const oppLevels = input.opponentAxis.levels
    .map((l) => `${l.id} (${l.label})`)
    .join(", ");

  try {
    const response = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Tu es un coach de jeux de combat (FGC) expert en stratégie conditionnelle. On te fournit une matrice de décision croisant l'état d'un joueur (colonnes) et l'état adverse (lignes). Tu dois remplir CHAQUE cellule avec l'action optimale.

Réponds STRICTEMENT en JSON :
{
  "cells": [
    { "myLevelId": "<id>", "opponentLevelId": "<id>", "content": "<stratégie markdown>" }
  ]
}

Règles :
- Une cellule par combinaison myLevelId × opponentLevelId (toutes les combinaisons)
- Utilise EXACTEMENT les ids fournis (pas de nouveaux ids)
- Chaque "content" : stratégie concrète et actionnable, 2-4 lignes max, vocabulaire FGC (frame trap, whiff punish, oki, mixup, hit confirm, DI, drive rush, etc.)
- Markdown supporté (**gras**, listes, →)
- Maximum 500 caractères par cellule
- Réponds en français`,
        },
        {
          role: "user",
          content: `Matrice : "${input.title}"${input.description ? `\nDescription : ${input.description}` : ""}${matchupContext ? `\nContexte : ${matchupContext}` : ""}

Axe COLONNES (mes états) — label "${input.myAxis.label}" (${input.myAxis.resource})
Niveaux : ${myLevels}

Axe LIGNES (état adverse) — label "${input.opponentAxis.label}" (${input.opponentAxis.resource})
Niveaux : ${oppLevels}

Génère ${input.myAxis.levels.length * input.opponentAxis.levels.length} cellules, une pour chaque combinaison.`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 3000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return null;
    }

    const parsed = matrixCellsSchema.parse(JSON.parse(content));
    const myIds = new Set(input.myAxis.levels.map((l) => l.id));
    const oppIds = new Set(input.opponentAxis.levels.map((l) => l.id));

    return parsed.cells.filter(
      (c) => myIds.has(c.myLevelId) && oppIds.has(c.opponentLevelId),
    );
  } catch {
    return null;
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
