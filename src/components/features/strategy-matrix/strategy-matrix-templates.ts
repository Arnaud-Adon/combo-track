import type { Axis, Cell } from "./strategy-matrix-schema";
import { createEmptyCells } from "./strategy-matrix-types";

export type StrategyMatrixTemplate = {
  id: string;
  name: string;
  description: string;
  title: string;
  myAxis: Axis;
  opponentAxis: Axis;
  cells: Cell[];
};

const hpMeterMyAxis: Axis = {
  label: "Mon HP",
  resource: "HP",
  levels: [
    { id: "hp-high", label: "Haut", order: 0 },
    { id: "hp-mid", label: "Moyen", order: 1 },
    { id: "hp-low", label: "Bas", order: 2 },
  ],
};

const hpMeterOpponentAxis: Axis = {
  label: "Meter adversaire",
  resource: "METER",
  levels: [
    { id: "meter-full", label: "Plein", order: 0 },
    { id: "meter-mid", label: "Moyen", order: 1 },
    { id: "meter-empty", label: "Vide", order: 2 },
  ],
};

const driveMyAxis: Axis = {
  label: "Mon Drive Gauge",
  resource: "DRIVE",
  levels: [
    { id: "drive-full", label: "Plein", order: 0 },
    { id: "drive-mid", label: "Moyen", order: 1 },
    { id: "drive-burnout", label: "Burnout", order: 2 },
  ],
};

const positionOpponentAxis: Axis = {
  label: "Position adversaire",
  resource: "POSITION",
  levels: [
    { id: "pos-midscreen", label: "Midscreen", order: 0 },
    { id: "pos-corner", label: "Corner", order: 1 },
  ],
};

const customMyAxis: Axis = {
  label: "Mon état",
  resource: "CUSTOM",
  levels: [
    { id: "my-a", label: "Niveau A", order: 0 },
    { id: "my-b", label: "Niveau B", order: 1 },
  ],
};

const customOpponentAxis: Axis = {
  label: "État adversaire",
  resource: "CUSTOM",
  levels: [
    { id: "opp-a", label: "Niveau A", order: 0 },
    { id: "opp-b", label: "Niveau B", order: 1 },
  ],
};

export const STRATEGY_MATRIX_TEMPLATES: StrategyMatrixTemplate[] = [
  {
    id: "hp-vs-meter",
    name: "HP × Meter (générique)",
    description: "Stratégie selon votre HP et le meter adverse",
    title: "Stratégie HP × Meter",
    myAxis: hpMeterMyAxis,
    opponentAxis: hpMeterOpponentAxis,
    cells: createEmptyCells(hpMeterMyAxis, hpMeterOpponentAxis),
  },
  {
    id: "drive-vs-position",
    name: "Drive Gauge × Position (SF6)",
    description: "Stratégie selon votre Drive et la position adverse",
    title: "Stratégie Drive × Position",
    myAxis: driveMyAxis,
    opponentAxis: positionOpponentAxis,
    cells: createEmptyCells(driveMyAxis, positionOpponentAxis),
  },
  {
    id: "custom-blank",
    name: "Vide / Personnalisé",
    description: "Démarrer avec une matrice vierge à personnaliser",
    title: "Nouvelle matrice",
    myAxis: customMyAxis,
    opponentAxis: customOpponentAxis,
    cells: createEmptyCells(customMyAxis, customOpponentAxis),
  },
];
