import type { Axis, Cell } from "./strategy-matrix-schema";

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

export const FGC_MOTIONS: NotationItem[] = [
  { value: "236", label: "236 (Quart de cercle avant / QCF)" },
  { value: "214", label: "214 (Quart de cercle arrière / QCB)" },
  { value: "623", label: "623 (Dragon punch / DP)" },
  { value: "421", label: "421 (Reverse DP)" },
  { value: "41236", label: "41236 (Demi-cercle avant / HCF)" },
  { value: "63214", label: "63214 (Demi-cercle arrière / HCB)" },
  { value: "22", label: "22 (Double bas)" },
  { value: "66", label: "66 (Dash avant)" },
  { value: "44", label: "44 (Backdash)" },
  { value: "360", label: "360 (Tour complet / SPD)" },
  { value: "720", label: "720 (Double tour)" },
  { value: "[4]6", label: "[4]6 (Charge arrière → avant)" },
  { value: "[2]8", label: "[2]8 (Charge bas → haut)" },
  { value: "[1]9", label: "[1]9 (Charge bas-arrière → haut-avant)" },
  { value: "[4]9", label: "[4]9 (Charge arrière → haut-avant)" },
  { value: "[4]646", label: "[4]646 (Charge super horizontale)" },
  { value: "[2]828", label: "[2]828 (Charge super verticale)" },
  { value: "236236", label: "236236 (Double QCF / Super)" },
  { value: "214214", label: "214214 (Double QCB / Super)" },
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
