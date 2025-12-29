"use server";

import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { s3Client } from "@/lib/s3-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

const imageSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Image must be less than 5MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPEG, PNG, and WebP images are allowed"
    ),
});

export async function uploadAvatarAction(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const file = formData.get("avatar") as File | null;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const validation = imageSchema.safeParse({ file });

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message ?? "Invalid file",
      };
    }

    const ext = file.type.split("/")[1];
    const filename = `avatars/${session.user.id}-${Date.now()}.${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const imageUrl = `${env.R2_URL}/${filename}`;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
    });

    revalidatePath("/");
    revalidatePath("/videos");

    return { success: true, imageUrl };
  } catch {
    return {
      success: false,
      error: "Failed to upload avatar. Please try again.",
    };
  }
}
