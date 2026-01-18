import z from "zod";

export const articleFormSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(200, "Le titre ne peut pas dépasser 200 caractères"),
  slug: z
    .string()
    .min(3, "Le slug doit contenir au moins 3 caractères")
    .max(200, "Le slug ne peut pas dépasser 200 caractères")
    .regex(
      /^[a-z0-9-]+$/,
      "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets",
    ),
  content: z
    .string()
    .min(10, "Le contenu doit contenir au moins 10 caractères"),
  excerpt: z
    .string()
    .max(500, "L'extrait ne peut pas dépasser 500 caractères")
    .optional()
    .or(z.literal("")),
  category: z.string().min(1, "La catégorie est requise"),
  published: z.boolean(),
});

export type ArticleFormSchemaType = z.infer<typeof articleFormSchema>;

export const createArticleSchema = articleFormSchema;

export const updateArticleSchema = articleFormSchema.extend({
  id: z.string().min(1),
});
