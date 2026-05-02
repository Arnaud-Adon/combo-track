import z from "zod";

export const characterFormSchema = z.object({
  gameId: z.string().min(1, "Le jeu est requis"),
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(60, "Le nom ne peut pas dépasser 60 caractères"),
  slug: z
    .string()
    .min(1, "Le slug est requis")
    .max(40, "Le slug ne peut pas dépasser 40 caractères")
    .regex(
      /^[a-z0-9-]+$/,
      "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets",
    ),
  iconUrl: z
    .string()
    .url("L'URL de l'icône n'est pas valide")
    .optional()
    .or(z.literal("")),
});

export type CharacterFormSchemaType = z.infer<typeof characterFormSchema>;

export const createCharacterSchema = characterFormSchema;

export const updateCharacterSchema = characterFormSchema.extend({
  id: z.string().min(1),
});
