"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  STRATEGY_MATRIX_TEMPLATES,
  type StrategyMatrixTemplate,
} from "./strategy-matrix-templates";

type Props = {
  onSelect: (template: StrategyMatrixTemplate) => void;
};

export function StrategyMatrixTemplateSelector({ onSelect }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {STRATEGY_MATRIX_TEMPLATES.map((template) => (
        <Card key={template.id} className="flex flex-col gap-3 p-4">
          <div>
            <h3 className="font-semibold">{template.name}</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              {template.description}
            </p>
          </div>
          <div className="text-muted-foreground text-xs">
            {template.myAxis.levels.length} ×{" "}
            {template.opponentAxis.levels.length} cellules
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSelect(template)}
            className="mt-auto"
          >
            Utiliser ce modèle
          </Button>
        </Card>
      ))}
    </div>
  );
}
