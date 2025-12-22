import z from "zod";

export const noteSchema = z.object({
  note: z.string().min(2, { error: "Note must be at least 2 characters" }),
  tagIds: z
    .array(z.string())
    .min(1, { error: "Au moins un tag doit être sélectionné" })
    .max(10, { error: "Maximum 10 tags autorisés" }),
});

export type NoteSchemaType = z.infer<typeof noteSchema>;
