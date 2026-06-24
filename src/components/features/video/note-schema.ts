import z from "zod";

export const MAX_NOTE_CONTENT_LENGTH = 2000;

export const noteSchema = z.object({
  note: z
    .string()
    .min(2, { error: "video.validation.noteMin" })
    .max(MAX_NOTE_CONTENT_LENGTH, { error: "video.validation.noteMax" }),
  tagIds: z
    .array(z.string())
    .min(1, { error: "video.validation.tagRequired" })
    .max(10, { error: "video.validation.tagMax" }),
});

export type NoteSchemaType = z.infer<typeof noteSchema>;
