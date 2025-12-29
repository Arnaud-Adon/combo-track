import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@/lib/env";

const globalForS3 = globalThis as unknown as {
  s3: S3Client | undefined;
};

export const s3Client =
  globalForS3.s3 ??
  new S3Client({
    region: "auto",
    endpoint: env.AWS_S3_API_URL,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY_ID,
    },
    forcePathStyle: true,
  });

if (process.env.NODE_ENV !== "production") globalForS3.s3 = s3Client;
