import z from "zod";

import {
  nameSchema,
  slugSchema,
  urlFieldSchema,
  withIdExtension,
} from "@/lib/validations/admin-schemas";

const base = "admin.validation.game";

export const gameFormSchema = z.object({
  name: nameSchema({ base, min: 2, max: 80 }),
  slug: slugSchema({ base, min: 2, max: 40 }),
  iconUrl: urlFieldSchema(`${base}.iconUrlInvalid`),
});

export type GameFormSchemaType = z.infer<typeof gameFormSchema>;

export const createGameSchema = gameFormSchema;

export const updateGameSchema = withIdExtension(gameFormSchema);
