"use server";

import { generateMatchReport } from "@/lib/ai/groq";
import { authActionClient } from "@/lib/auth-action";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

export const generateReportAction = authActionClient
  .inputSchema(
    z.object({
      matchId: z.string().min(1),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const { matchId } = parsedInput;
    const t = await getTranslations("video.errors");

    const match = await prisma.match.findUnique({
      where: { id: matchId, userId: ctx.user.id },
    });

    if (!match) {
      throw new Error(t("matchNotFound"));
    }

    const notes = await prisma.note.findMany({
      where: { matchId },
      include: { tags: true },
      orderBy: { timestamp: "asc" },
    });

    if (notes.length < 3) {
      throw new Error(t("notEnoughNotes"));
    }

    const formattedNotes = notes.map((note) => ({
      timestamp: note.timestamp,
      content: note.content,
      tags: note.tags.map((t) => t.name),
    }));

    const report = await generateMatchReport(formattedNotes, match.title);

    if (!report) {
      throw new Error(t("generationFailed"));
    }

    await prisma.matchReport.upsert({
      where: { matchId },
      create: {
        matchId,
        summary: report.summary,
        strengths: JSON.stringify(report.strengths),
        weakness: report.weakness,
        keyMoments: JSON.stringify(report.keyMoments),
        recommendations: JSON.stringify(report.recommendations),
      },
      update: {
        summary: report.summary,
        strengths: JSON.stringify(report.strengths),
        weakness: report.weakness,
        keyMoments: JSON.stringify(report.keyMoments),
        recommendations: JSON.stringify(report.recommendations),
      },
    });

    await prisma.match.update({
      where: { id: matchId },
      data: { status: "ANALYZED" },
    });

    return report;
  });
