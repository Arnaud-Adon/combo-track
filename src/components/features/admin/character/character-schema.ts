import z from "zod";

export const characterFormSchema = z.object({
  gameId: z.string().min(1, "admin.validation.character.gameRequired"),
  name: z
    .string()
    .min(2, "admin.validation.character.nameMin")
    .max(60, "admin.validation.character.nameMax"),
  slug: z
    .string()
    .min(1, "admin.validation.character.slugRequired")
    .max(40, "admin.validation.character.slugMax")
    .regex(/^[a-z0-9-]+$/, "admin.validation.character.slugFormat"),
  iconUrl: z
    .string()
    .url("admin.validation.character.iconUrlInvalid")
    .optional()
    .or(z.literal("")),
});

export type CharacterFormSchemaType = z.infer<typeof characterFormSchema>;

export const createCharacterSchema = characterFormSchema;

export const updateCharacterSchema = characterFormSchema.extend({
  id: z.string().min(1),
});
