import z from "zod";

export const RESOURCE_TYPES = [
  "HP",
  "METER",
  "DRIVE",
  "POSITION",
  "CUSTOM",
] as const;

export const levelSchema = z.object({
  id: z.string().min(1),
  label: z
    .string()
    .min(1, { error: "strategyMatrix.validation.levelLabelRequired" })
    .max(60, { error: "strategyMatrix.validation.levelLabelMax" }),
  order: z.number().int().min(0),
});

export const axisSchema = z
  .object({
    label: z
      .string()
      .min(1, { error: "strategyMatrix.validation.axisLabelRequired" })
      .max(60, { error: "strategyMatrix.validation.axisLabelMax" }),
    resource: z.enum(RESOURCE_TYPES),
    levels: z
      .array(levelSchema)
      .min(2, { error: "strategyMatrix.validation.levelsMin" })
      .max(5, { error: "strategyMatrix.validation.levelsMax" }),
  })
  .refine(
    (axis) => new Set(axis.levels.map((l) => l.id)).size === axis.levels.length,
    { error: "strategyMatrix.validation.levelIdsUnique" },
  );

export const cellSchema = z.object({
  myLevelId: z.string().min(1),
  opponentLevelId: z.string().min(1),
  content: z
    .string()
    .max(2000, { error: "strategyMatrix.validation.cellContentMax" }),
});

const matrixBaseSchema = z
  .object({
    title: z
      .string()
      .min(1, { error: "strategyMatrix.validation.titleRequired" })
      .max(120, { error: "strategyMatrix.validation.titleMax" }),
    description: z
      .string()
      .max(500, { error: "strategyMatrix.validation.descriptionMax" })
      .optional(),
    gameId: z.string().min(1).optional(),
    myCharacterId: z.string().min(1).optional(),
    opponentCharacterId: z.string().min(1).optional(),
    myAxis: axisSchema,
    opponentAxis: axisSchema,
    cells: z.array(cellSchema),
  })
  .refine(
    (data) => {
      const myIds = new Set(data.myAxis.levels.map((l) => l.id));
      const oppIds = new Set(data.opponentAxis.levels.map((l) => l.id));
      return data.cells.every(
        (c) => myIds.has(c.myLevelId) && oppIds.has(c.opponentLevelId),
      );
    },
    { error: "strategyMatrix.validation.orphanCells" },
  )
  .refine(
    (data) => {
      if (data.myCharacterId && !data.gameId) return false;
      if (data.opponentCharacterId && !data.gameId) return false;
      return true;
    },
    { error: "strategyMatrix.validation.gameRequiredForCharacter" },
  );

export const strategyMatrixCreateSchema = matrixBaseSchema;

export const strategyMatrixUpdateSchema = z.intersection(
  z.object({ id: z.string().min(1) }),
  matrixBaseSchema,
);

export const strategyMatrixDeleteSchema = z.object({
  id: z.string().min(1, { error: "strategyMatrix.validation.idRequired" }),
});

export type Level = z.infer<typeof levelSchema>;
export type Axis = z.infer<typeof axisSchema>;
export type Cell = z.infer<typeof cellSchema>;
export type StrategyMatrixCreateInput = z.infer<
  typeof strategyMatrixCreateSchema
>;
export type StrategyMatrixUpdateInput = z.infer<
  typeof strategyMatrixUpdateSchema
>;
export type ResourceType = (typeof RESOURCE_TYPES)[number];
