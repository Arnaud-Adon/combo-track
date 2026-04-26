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
import { Plus, Trash2 } from "lucide-react";
import type { Axis, Level, ResourceType } from "./strategy-matrix-schema";
import { RESOURCE_TYPES } from "./strategy-matrix-schema";
import {
  MAX_LEVELS,
  MIN_LEVELS,
  RESOURCE_TYPE_LABELS,
} from "./strategy-matrix-types";

type Props = {
  axis: Axis;
  onChange: (axis: Axis) => void;
  heading: string;
};

function generateLevelId(): string {
  return `lvl-${Math.random().toString(36).slice(2, 10)}`;
}

export function StrategyMatrixAxisBuilder({ axis, onChange, heading }: Props) {
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
      label: `Niveau ${axis.levels.length + 1}`,
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
    <div className="space-y-3 rounded-lg border p-4">
      <h3 className="text-sm font-semibold">{heading}</h3>

      <div className="space-y-2">
        <Label htmlFor={`axis-label-${heading}`}>Libellé de l&apos;axe</Label>
        <Input
          id={`axis-label-${heading}`}
          value={axis.label}
          onChange={(e) => updateLabel(e.target.value)}
          placeholder="Ex: Mon meter"
        />
      </div>

      <div className="space-y-2">
        <Label>Type de ressource</Label>
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
                {RESOURCE_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>
            Niveaux ({axis.levels.length}/{MAX_LEVELS})
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addLevel}
            disabled={axis.levels.length >= MAX_LEVELS}
          >
            <Plus className="mr-1 h-3 w-3" />
            Ajouter
          </Button>
        </div>
        <div className="space-y-2">
          {axis.levels.map((level, index) => (
            <div key={level.id} className="flex items-center gap-2">
              <Input
                value={level.label}
                onChange={(e) => updateLevel(index, { label: e.target.value })}
                placeholder={`Niveau ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLevel(index)}
                disabled={axis.levels.length <= MIN_LEVELS}
                aria-label={`Supprimer ${level.label}`}
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
