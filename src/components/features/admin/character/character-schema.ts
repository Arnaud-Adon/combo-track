import z from "zod";

import {
  nameSchema,
  slugSchema,
  urlFieldSchema,
  withIdExtension,
} from "@/lib/validations/admin-schemas";

const base = "admin.validation.character";

export const characterFormSchema = z.object({
  gameId: z.string().min(1, `${base}.gameRequired`),
  name: nameSchema({ base, min: 2, max: 60 }),
  slug: slugSchema({ base, min: 1, max: 40, minKey: "slugRequired" }),
  iconUrl: urlFieldSchema(`${base}.iconUrlInvalid`),
});

export type CharacterFormSchemaType = z.infer<typeof characterFormSchema>;

export const createCharacterSchema = characterFormSchema;

export const updateCharacterSchema = withIdExtension(characterFormSchema);
