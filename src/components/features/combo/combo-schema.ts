import z from "zod";

export const comboFormSchema = z.object({
  characterId: z.string().min(1, "Le personnage est requis"),
  title: z
    .string()
    .min(2, "Le titre doit contenir au moins 2 caractères")
    .max(120, "Le titre ne peut pas dépasser 120 caractères"),
  notation: z
    .string()
    .min(1, "La notation est requise")
    .max(500, "La notation ne peut pas dépasser 500 caractères"),
  damage: z.number().int().min(0).max(9999).optional(),
  meterUsed: z.number().int().min(0).max(10).optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
  notes: z
    .string()
    .max(2000, "Les notes ne peuvent pas dépasser 2000 caractères")
    .optional(),
  tagIds: z.array(z.string()).max(10, "Maximum 10 tags autorisés"),
  sourceNoteId: z.string().optional(),
});

export type ComboFormSchemaType = z.infer<typeof comboFormSchema>;

export const createComboSchema = comboFormSchema;

export const updateComboSchema = comboFormSchema.extend({
  id: z.string().min(1),
});
