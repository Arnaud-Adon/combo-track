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

/**
 * Translator scoped to the `strategyMatrix` namespace.
 * Templates store i18n KEYS (relative to that namespace) as their labels —
 * hooks cannot run in this module, so labels are resolved at render time by the
 * consuming components via {@link resolveStrategyMatrixTemplates}.
 */
export type TemplateTranslator = (key: string) => string;

const hpMeterMyAxis: Axis = {
  label: "templates.hpVsMeter.myAxisLabel",
  resource: "HP",
  levels: [
    { id: "hp-high", label: "templates.levels.high", order: 0 },
    { id: "hp-mid", label: "templates.levels.mid", order: 1 },
    { id: "hp-low", label: "templates.levels.low", order: 2 },
  ],
};

const hpMeterOpponentAxis: Axis = {
  label: "templates.hpVsMeter.opponentAxisLabel",
  resource: "METER",
  levels: [
    { id: "meter-full", label: "templates.levels.full", order: 0 },
    { id: "meter-mid", label: "templates.levels.mid", order: 1 },
    { id: "meter-empty", label: "templates.levels.empty", order: 2 },
  ],
};

const driveMyAxis: Axis = {
  label: "templates.driveVsPosition.myAxisLabel",
  resource: "DRIVE",
  levels: [
    { id: "drive-full", label: "templates.levels.full", order: 0 },
    { id: "drive-mid", label: "templates.levels.mid", order: 1 },
    { id: "drive-burnout", label: "templates.levels.burnout", order: 2 },
  ],
};

const positionOpponentAxis: Axis = {
  label: "templates.driveVsPosition.opponentAxisLabel",
  resource: "POSITION",
  levels: [
    { id: "pos-midscreen", label: "templates.levels.midscreen", order: 0 },
    { id: "pos-corner", label: "templates.levels.corner", order: 1 },
  ],
};

const customMyAxis: Axis = {
  label: "templates.customBlank.myAxisLabel",
  resource: "CUSTOM",
  levels: [
    { id: "my-a", label: "templates.levels.levelA", order: 0 },
    { id: "my-b", label: "templates.levels.levelB", order: 1 },
  ],
};

const customOpponentAxis: Axis = {
  label: "templates.customBlank.opponentAxisLabel",
  resource: "CUSTOM",
  levels: [
    { id: "opp-a", label: "templates.levels.levelA", order: 0 },
    { id: "opp-b", label: "templates.levels.levelB", order: 1 },
  ],
};

export const STRATEGY_MATRIX_TEMPLATES: StrategyMatrixTemplate[] = [
  {
    id: "hp-vs-meter",
    name: "templates.hpVsMeter.name",
    description: "templates.hpVsMeter.description",
    title: "templates.hpVsMeter.title",
    myAxis: hpMeterMyAxis,
    opponentAxis: hpMeterOpponentAxis,
    cells: createEmptyCells(hpMeterMyAxis, hpMeterOpponentAxis),
  },
  {
    id: "drive-vs-position",
    name: "templates.driveVsPosition.name",
    description: "templates.driveVsPosition.description",
    title: "templates.driveVsPosition.title",
    myAxis: driveMyAxis,
    opponentAxis: positionOpponentAxis,
    cells: createEmptyCells(driveMyAxis, positionOpponentAxis),
  },
  {
    id: "custom-blank",
    name: "templates.customBlank.name",
    description: "templates.customBlank.description",
    title: "templates.customBlank.title",
    myAxis: customMyAxis,
    opponentAxis: customOpponentAxis,
    cells: createEmptyCells(customMyAxis, customOpponentAxis),
  },
];

function resolveAxis(axis: Axis, t: TemplateTranslator): Axis {
  return {
    ...axis,
    label: t(axis.label),
    levels: axis.levels.map((level) => ({ ...level, label: t(level.label) })),
  };
}

/**
 * Resolve the i18n KEYS stored in {@link STRATEGY_MATRIX_TEMPLATES} into the
 * localized labels. Cells only reference level ids, so they are left untouched.
 */
export function resolveStrategyMatrixTemplates(
  t: TemplateTranslator,
): StrategyMatrixTemplate[] {
  return STRATEGY_MATRIX_TEMPLATES.map((template) => ({
    ...template,
    name: t(template.name),
    description: t(template.description),
    title: t(template.title),
    myAxis: resolveAxis(template.myAxis, t),
    opponentAxis: resolveAxis(template.opponentAxis, t),
  }));
}
