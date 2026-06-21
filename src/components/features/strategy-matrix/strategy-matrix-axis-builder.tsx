"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Axis, Level, ResourceType } from "./strategy-matrix-schema";
import { RESOURCE_TYPES } from "./strategy-matrix-schema";
import { MAX_LEVELS, MIN_LEVELS } from "./strategy-matrix-types";

type Props = {
  axis: Axis;
  onChange: (axis: Axis) => void;
  heading: string;
  tone?: "mine" | "opponent";
};

function generateLevelId(): string {
  return `lvl-${Math.random().toString(36).slice(2, 10)}`;
}

export function StrategyMatrixAxisBuilder({
  axis,
  onChange,
  heading,
  tone = "mine",
}: Props) {
  const t = useTranslations("strategyMatrix");
  const updateLabel = (label: string) => onChange({ ...axis, label });

  const updateResource = (resource: ResourceType) =>
    onChange({ ...axis, resource });

  const updateLevel = (index: number, partial: Partial<Level>) => {
    const levels = axis.levels.map((lvl, i) =>
      i === index ? { ...lvl, ...partial } : lvl,
    );
    onChange({ ...axis, levels });
  };

  const addLevel = () => {
    if (axis.levels.length >= MAX_LEVELS) return;
    const newLevel: Level = {
      id: generateLevelId(),
      label: t("axisBuilder.levelDefault", { n: axis.levels.length + 1 }),
      order: axis.levels.length,
    };
    onChange({ ...axis, levels: [...axis.levels, newLevel] });
  };

  const removeLevel = (index: number) => {
    if (axis.levels.length <= MIN_LEVELS) return;
    const levels = axis.levels
      .filter((_, i) => i !== index)
      .map((lvl, i) => ({ ...lvl, order: i }));
    onChange({ ...axis, levels });
  };

  return (
    <div className="border-border bg-card space-y-3 rounded-xl border p-4">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "size-2 rounded-full",
            tone === "mine" ? "bg-primary" : "bg-muted-foreground",
          )}
        />
        <h3 className="font-display text-sm uppercase">{heading}</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`axis-label-${heading}`}>
          {t("axisBuilder.axisLabel")}
        </Label>
        <Input
          id={`axis-label-${heading}`}
          value={axis.label}
          onChange={(e) => updateLabel(e.target.value)}
          placeholder={t("axisBuilder.axisLabelPlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <Label>{t("axisBuilder.resourceType")}</Label>
        <Select
          value={axis.resource}
          onValueChange={(v) => updateResource(v as ResourceType)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RESOURCE_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {t(`resourceTypes.${type}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>
            {t("axisBuilder.levels", {
              count: axis.levels.length,
              max: MAX_LEVELS,
            })}
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addLevel}
            disabled={axis.levels.length >= MAX_LEVELS}
          >
            <Plus className="mr-1 h-3 w-3" />
            {t("axisBuilder.add")}
          </Button>
        </div>
        <div className="space-y-2">
          {axis.levels.map((level, index) => (
            <div key={level.id} className="flex items-center gap-2">
              <Input
                value={level.label}
                onChange={(e) => updateLevel(index, { label: e.target.value })}
                placeholder={t("axisBuilder.levelPlaceholder", {
                  n: index + 1,
                })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLevel(index)}
                disabled={axis.levels.length <= MIN_LEVELS}
                aria-label={t("axisBuilder.removeLevel", { label: level.label })}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
