import z from "zod";

export const comboFormSchema = z.object({
  characterId: z.string().min(1, "combo.validation.characterRequired"),
  title: z
    .string()
    .min(2, "combo.validation.titleMin")
    .max(120, "combo.validation.titleMax"),
  notation: z
    .string()
    .min(1, "combo.validation.notationRequired")
    .max(500, "combo.validation.notationMax"),
  damage: z.number().int().min(0).max(9999).optional(),
  meterUsed: z.number().int().min(0).max(10).optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
  notes: z.string().max(2000, "combo.validation.notesMax").optional(),
  tagIds: z.array(z.string()).max(10, "combo.validation.tagsMax"),
  sourceNoteId: z.string().optional(),
});

export type ComboFormSchemaType = z.infer<typeof comboFormSchema>;

export const createComboSchema = comboFormSchema;

export const updateComboSchema = comboFormSchema.extend({
  id: z.string().min(1),
});
