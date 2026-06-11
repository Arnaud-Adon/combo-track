"use server";

import { requireAdmin } from "@/lib/auth-utils";
import { env } from "@/lib/env";
import { s3Client } from "@/lib/s3-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

const imageSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 2 * 1024 * 1024,
      "Image must be less than 2MB",
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPEG, PNG, and WebP images are allowed",
    ),
});

export async function uploadGlossaryImageAction(formData: FormData) {
  try {
    await requireAdmin();

    const file = formData.get("image") as File | null;

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
    const filename = `glossary/${crypto.randomUUID()}-${Date.now()}.${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    const imageUrl = `${env.R2_URL}/${filename}`;

    return { success: true, imageUrl };
  } catch {
    return {
      success: false,
      error: "Failed to upload image. Please try again.",
    };
  }
}
