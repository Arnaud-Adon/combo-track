import z from "zod";

import {
  nameSchema,
  slugSchema,
  urlFieldSchema,
  withIdExtension,
} from "@/lib/validations/admin-schemas";

const base = "admin.validation.article";

export const articleFormSchema = z.object({
  title: nameSchema({ base, min: 3, max: 200, field: "title" }),
  slug: slugSchema({ base, min: 3, max: 200 }),
  content: z.string().min(10, `${base}.contentMin`),
  excerpt: z
    .string()
    .max(500, `${base}.excerptMax`)
    .optional()
    .or(z.literal("")),
  category: z.string().min(1, `${base}.categoryRequired`),
  image: urlFieldSchema(`${base}.imageInvalid`),
  published: z.boolean(),
});

export type ArticleFormSchemaType = z.infer<typeof articleFormSchema>;

export const createArticleSchema = articleFormSchema;

export const updateArticleSchema = withIdExtension(articleFormSchema);
