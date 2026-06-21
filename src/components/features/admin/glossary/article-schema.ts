import z from "zod";

export const articleFormSchema = z.object({
  title: z
    .string()
    .min(3, "admin.validation.article.titleMin")
    .max(200, "admin.validation.article.titleMax"),
  slug: z
    .string()
    .min(3, "admin.validation.article.slugMin")
    .max(200, "admin.validation.article.slugMax")
    .regex(/^[a-z0-9-]+$/, "admin.validation.article.slugFormat"),
  content: z.string().min(10, "admin.validation.article.contentMin"),
  excerpt: z
    .string()
    .max(500, "admin.validation.article.excerptMax")
    .optional()
    .or(z.literal("")),
  category: z.string().min(1, "admin.validation.article.categoryRequired"),
  image: z
    .string()
    .url("admin.validation.article.imageInvalid")
    .optional()
    .or(z.literal("")),
  published: z.boolean(),
});

export type ArticleFormSchemaType = z.infer<typeof articleFormSchema>;

export const createArticleSchema = articleFormSchema;

export const updateArticleSchema = articleFormSchema.extend({
  id: z.string().min(1),
});
