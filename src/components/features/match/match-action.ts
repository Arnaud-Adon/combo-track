"use server";

import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/auth-action";
import { getVideoDetails, isStreetFighter6 } from "@/lib/youtube";
import { extractYoutubeVideoId } from "@/utils";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";
import { matchFormSchema } from "./match-schema";

export const createMatchAction = authActionClient
  .inputSchema(matchFormSchema)
  .action(async ({ parsedInput, ctx }) => {
    const t = await getTranslations("match");
    const { videoUrl, title } = parsedInput;

    const videoId = extractYoutubeVideoId(videoUrl);

    if (!videoId) {
      throw new Error(t("errors.invalidYoutubeUrl"));
    }

    const videoDetails = await getVideoDetails(videoId);

    if (!isStreetFighter6(videoDetails)) {
      throw new Error(t("errors.notStreetFighter6"));
    }

    const match = await prisma.match.create({
      data: {
        title,
        videoUrl,
        userId: ctx.user.id,
      },
    });

    revalidatePath("/dashboard");

    return match;
  });

export const deleteMatchAction = authActionClient
  .inputSchema(
    z.object({
      matchId: z.string().min(1, "match.validation.idRequired"),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    await prisma.match.delete({
      where: { id: parsedInput.matchId, userId: ctx.user.id },
    });

    return { success: true };
  });
