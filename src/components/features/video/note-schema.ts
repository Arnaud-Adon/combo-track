import z from "zod";

export const noteSchema = z.object({
  note: z.string().min(2, { error: "Note must be at least 2 characters" }),
});

export type NoteSchemaType = z.infer<typeof noteSchema>;
