import type { Axis, Cell, ResourceType } from "./strategy-matrix-schema";

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  HP: "Vie",
  METER: "Jauge Super",
  DRIVE: "Drive Gauge",
  POSITION: "Position",
  CUSTOM: "Personnalisé",
};

type NotationItem = { value: string; label: string };

export const FGC_POSITIONS: NotationItem[] = [
  { value: "st.", label: "st. (Standing)" },
  { value: "cr.", label: "cr. (Crouching)" },
  { value: "j.", label: "j. (Jump)" },
  { value: "nj.", label: "nj. (Neutral Jump)" },
  { value: "fj.", label: "fj. (Forward Jump)" },
  { value: "bj.", label: "bj. (Back Jump)" },
];

export const FGC_BUTTONS: NotationItem[] = [
  { value: "LP", label: "LP (Light Punch)" },
  { value: "MP", label: "MP (Medium Punch)" },
  { value: "HP", label: "HP (Heavy Punch)" },
  { value: "LK", label: "LK (Light Kick)" },
  { value: "MK", label: "MK (Medium Kick)" },
  { value: "HK", label: "HK (Heavy Kick)" },
];

export const FGC_ACTIONS: NotationItem[] = [
  { value: "Throw", label: "Throw" },
  { value: "DR", label: "DR (Drive Rush)" },
  { value: "DI", label: "DI (Drive Impact)" },
  { value: "SA1", label: "SA1 (Super Art 1)" },
  { value: "SA2", label: "SA2 (Super Art 2)" },
  { value: "SA3", label: "SA3 (Super Art 3)" },
  { value: "OD", label: "OD (Overdrive)" },
  { value: "xx", label: "xx (Cancel)" },
  { value: "→", label: "→ (Link)" },
  { value: "Dash", label: "Dash" },
  { value: "Backdash", label: "Backdash" },
];

export const FRAME_OPTIONS = [
  { value: "(+)", label: "Avantage (+)", cursorOffset: 2 },
  { value: "(-)", label: "Désavantage (-)", cursorOffset: 2 },
  { value: "(0)", label: "Neutre (0)" },
] as const;

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
