import z from "zod";

export const matchFormSchema = z.object({
  videoUrl: z
    .string()
    .url("L'URL n'est pas valide")
    .refine(
      (url) => url.includes("youtube.com") || url.includes("youtu.be"),
      "L'URL doit être un lien YouTube",
    ),
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(200, "Le titre ne peut pas dépasser 200 caractères"),
});

export type MatchFormSchemaType = z.infer<typeof matchFormSchema>;
