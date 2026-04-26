import { describe, expect, it } from "vitest";
import {
  axisSchema,
  cellSchema,
  strategyMatrixCreateSchema,
} from "./strategy-matrix-schema";
import { STRATEGY_MATRIX_TEMPLATES } from "./strategy-matrix-templates";

describe("axisSchema", () => {
  const validAxis = {
    label: "Mon meter",
    resource: "METER" as const,
    levels: [
      { id: "a", label: "Plein", order: 0 },
      { id: "b", label: "Vide", order: 1 },
    ],
  };

  it("accepts a valid axis", () => {
    expect(axisSchema.safeParse(validAxis).success).toBe(true);
  });

  it("rejects fewer than 2 levels", () => {
    const result = axisSchema.safeParse({
      ...validAxis,
      levels: [{ id: "a", label: "Plein", order: 0 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 5 levels", () => {
    const result = axisSchema.safeParse({
      ...validAxis,
      levels: Array.from({ length: 6 }, (_, i) => ({
        id: `id-${i}`,
        label: `L${i}`,
        order: i,
      })),
    });
    expect(result.success).toBe(false);
  });

  it("rejects duplicated level ids", () => {
    const result = axisSchema.safeParse({
      ...validAxis,
      levels: [
        { id: "dup", label: "A", order: 0 },
        { id: "dup", label: "B", order: 1 },
      ],
    });
    expect(result.success).toBe(false);
  });
});

describe("cellSchema", () => {
  it("rejects content longer than 2000 chars", () => {
    const result = cellSchema.safeParse({
      myLevelId: "a",
      opponentLevelId: "b",
      content: "x".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("accepts empty content", () => {
    const result = cellSchema.safeParse({
      myLevelId: "a",
      opponentLevelId: "b",
      content: "",
    });
    expect(result.success).toBe(true);
  });
});

describe("strategyMatrixCreateSchema", () => {
  const baseTemplate = STRATEGY_MATRIX_TEMPLATES[0];

  it("accepts each template", () => {
    for (const template of STRATEGY_MATRIX_TEMPLATES) {
      const result = strategyMatrixCreateSchema.safeParse({
        title: template.title,
        myAxis: template.myAxis,
        opponentAxis: template.opponentAxis,
        cells: template.cells,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects orphan cells referencing unknown levels", () => {
    const result = strategyMatrixCreateSchema.safeParse({
      title: baseTemplate.title,
      myAxis: baseTemplate.myAxis,
      opponentAxis: baseTemplate.opponentAxis,
      cells: [
        {
          myLevelId: "does-not-exist",
          opponentLevelId: baseTemplate.opponentAxis.levels[0].id,
          content: "",
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty title", () => {
    const result = strategyMatrixCreateSchema.safeParse({
      title: "",
      myAxis: baseTemplate.myAxis,
      opponentAxis: baseTemplate.opponentAxis,
      cells: baseTemplate.cells,
    });
    expect(result.success).toBe(false);
  });
});
