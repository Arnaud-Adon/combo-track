import z from "zod";

export const noteSchema = z.object({
  note: z.string().min(2, { error: "video.validation.noteMin" }),
  tagIds: z
    .array(z.string())
    .min(1, { error: "video.validation.tagRequired" })
    .max(10, { error: "video.validation.tagMax" }),
});

export type NoteSchemaType = z.infer<typeof noteSchema>;
