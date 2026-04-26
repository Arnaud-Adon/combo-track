import type { Axis, Cell, ResourceType } from "./strategy-matrix-schema";

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  HP: "Vie",
  METER: "Jauge Super",
  DRIVE: "Drive Gauge",
  POSITION: "Position",
  CUSTOM: "Personnalisé",
};

export const MIN_LEVELS = 2;
export const MAX_LEVELS = 5;
export const MAX_CELL_LENGTH = 2000;
export const MAX_TITLE_LENGTH = 120;
export const MAX_DESCRIPTION_LENGTH = 500;

export function cellKey(myLevelId: string, opponentLevelId: string): string {
  return `${myLevelId}::${opponentLevelId}`;
}

export function buildCellLookup(cells: Cell[]): Map<string, Cell> {
  const map = new Map<string, Cell>();
  for (const cell of cells) {
    map.set(cellKey(cell.myLevelId, cell.opponentLevelId), cell);
  }
  return map;
}

export function createEmptyCells(myAxis: Axis, opponentAxis: Axis): Cell[] {
  const cells: Cell[] = [];
  for (const my of myAxis.levels) {
    for (const opp of opponentAxis.levels) {
      cells.push({
        myLevelId: my.id,
        opponentLevelId: opp.id,
        content: "",
      });
    }
  }
  return cells;
}

export function reconcileCells(
  currentCells: Cell[],
  myAxis: Axis,
  opponentAxis: Axis,
): Cell[] {
  const lookup = buildCellLookup(currentCells);
  const reconciled: Cell[] = [];
  for (const my of myAxis.levels) {
    for (const opp of opponentAxis.levels) {
      const existing = lookup.get(cellKey(my.id, opp.id));
      reconciled.push(
        existing ?? {
          myLevelId: my.id,
          opponentLevelId: opp.id,
          content: "",
        },
      );
    }
  }
  return reconciled;
}
