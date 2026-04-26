import { describe, expect, it } from "vitest";
import type { Axis } from "./strategy-matrix-schema";
import { STRATEGY_MATRIX_TEMPLATES } from "./strategy-matrix-templates";
import {
  buildCellLookup,
  cellKey,
  createEmptyCells,
  reconcileCells,
} from "./strategy-matrix-types";

describe("createEmptyCells", () => {
  it("creates the cartesian product of axes", () => {
    const myAxis: Axis = {
      label: "X",
      resource: "CUSTOM",
      levels: [
        { id: "a", label: "A", order: 0 },
        { id: "b", label: "B", order: 1 },
      ],
    };
    const opponentAxis: Axis = {
      label: "Y",
      resource: "CUSTOM",
      levels: [
        { id: "c", label: "C", order: 0 },
        { id: "d", label: "D", order: 1 },
        { id: "e", label: "E", order: 2 },
      ],
    };
    const cells = createEmptyCells(myAxis, opponentAxis);
    expect(cells).toHaveLength(6);
    expect(cells.every((c) => c.content === "")).toBe(true);
  });
});

describe("reconcileCells", () => {
  const template = STRATEGY_MATRIX_TEMPLATES[0];

  it("preserves existing cells when axes are unchanged", () => {
    const filled = template.cells.map((c, i) => ({
      ...c,
      content: `note-${i}`,
    }));
    const reconciled = reconcileCells(
      filled,
      template.myAxis,
      template.opponentAxis,
    );
    expect(reconciled.map((c) => c.content)).toEqual(
      filled.map((c) => c.content),
    );
  });

  it("drops orphan cells when a level is removed", () => {
    const trimmedMyAxis: Axis = {
      ...template.myAxis,
      levels: template.myAxis.levels.slice(0, 2),
    };
    const filled = template.cells.map((c) => ({ ...c, content: "x" }));
    const reconciled = reconcileCells(
      filled,
      trimmedMyAxis,
      template.opponentAxis,
    );
    expect(reconciled).toHaveLength(
      trimmedMyAxis.levels.length * template.opponentAxis.levels.length,
    );
    const validIds = new Set(trimmedMyAxis.levels.map((l) => l.id));
    expect(reconciled.every((c) => validIds.has(c.myLevelId))).toBe(true);
  });

  it("creates blank cells for newly added levels", () => {
    const extendedMyAxis: Axis = {
      ...template.myAxis,
      levels: [
        ...template.myAxis.levels,
        {
          id: "hp-new",
          label: "Nouveau",
          order: template.myAxis.levels.length,
        },
      ],
    };
    const filled = template.cells.map((c) => ({ ...c, content: "kept" }));
    const reconciled = reconcileCells(
      filled,
      extendedMyAxis,
      template.opponentAxis,
    );
    const newCells = reconciled.filter((c) => c.myLevelId === "hp-new");
    expect(newCells).toHaveLength(template.opponentAxis.levels.length);
    expect(newCells.every((c) => c.content === "")).toBe(true);
  });
});

describe("buildCellLookup", () => {
  it("indexes cells by composite key", () => {
    const cells = [
      { myLevelId: "a", opponentLevelId: "x", content: "1" },
      { myLevelId: "a", opponentLevelId: "y", content: "2" },
      { myLevelId: "b", opponentLevelId: "x", content: "3" },
    ];
    const lookup = buildCellLookup(cells);
    expect(lookup.get(cellKey("a", "x"))?.content).toBe("1");
    expect(lookup.get(cellKey("b", "x"))?.content).toBe("3");
    expect(lookup.get(cellKey("z", "z"))).toBeUndefined();
  });
});
