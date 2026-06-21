import z from "zod";

export const matchFormSchema = z.object({
  videoUrl: z
    .string()
    .url("match.validation.urlInvalid")
    .refine(
      (url) => url.includes("youtube.com") || url.includes("youtu.be"),
      "match.validation.urlNotYoutube",
    ),
  title: z
    .string()
    .min(3, "match.validation.titleMin")
    .max(200, "match.validation.titleMax"),
});

export type MatchFormSchemaType = z.infer<typeof matchFormSchema>;
