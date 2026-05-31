import z from "zod";

export const MAX_MEMO_TITLE_LENGTH = 120;
export const MAX_MEMO_CONTENT_LENGTH = 2000;

export const memoFormSchema = z.object({
  title: z
    .string()
    .min(1, { error: "Le titre est requis" })
    .max(MAX_MEMO_TITLE_LENGTH, {
      error: `Maximum ${MAX_MEMO_TITLE_LENGTH} caractères`,
    }),
  content: z
    .string()
    .max(MAX_MEMO_CONTENT_LENGTH, {
      error: `Maximum ${MAX_MEMO_CONTENT_LENGTH} caractères`,
    }),
});

export type MemoFormInput = z.infer<typeof memoFormSchema>;

export const createMemoSchema = memoFormSchema;

export const updateMemoSchema = memoFormSchema.extend({
  id: z.string().min(1),
});

export const deleteMemoSchema = z.object({
  id: z.string().min(1, { error: "L'ID du mémo est requis" }),
});
