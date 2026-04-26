import z from "zod";

export const gameFormSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(80, "Le nom ne peut pas dépasser 80 caractères"),
  slug: z
    .string()
    .min(2, "Le slug doit contenir au moins 2 caractères")
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

export type GameFormSchemaType = z.infer<typeof gameFormSchema>;

export const createGameSchema = gameFormSchema;

export const updateGameSchema = gameFormSchema.extend({
  id: z.string().min(1),
});
