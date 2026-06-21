import z from "zod";

export const gameFormSchema = z.object({
  name: z
    .string()
    .min(2, "admin.validation.game.nameMin")
    .max(80, "admin.validation.game.nameMax"),
  slug: z
    .string()
    .min(2, "admin.validation.game.slugMin")
    .max(40, "admin.validation.game.slugMax")
    .regex(/^[a-z0-9-]+$/, "admin.validation.game.slugFormat"),
  iconUrl: z
    .string()
    .url("admin.validation.game.iconUrlInvalid")
    .optional()
    .or(z.literal("")),
});

export type GameFormSchemaType = z.infer<typeof gameFormSchema>;

export const createGameSchema = gameFormSchema;

export const updateGameSchema = gameFormSchema.extend({
  id: z.string().min(1),
});
