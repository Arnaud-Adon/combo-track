"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import type { Translator } from "@/types/translator";
import {
  resolveStrategyMatrixTemplates,
  type StrategyMatrixTemplate,
} from "./strategy-matrix-templates";

type Props = {
  onSelect: (template: StrategyMatrixTemplate) => void;
};

export function StrategyMatrixTemplateSelector({ onSelect }: Props) {
  const t = useTranslations("strategyMatrix");
  const templates = resolveStrategyMatrixTemplates(
    t as unknown as Translator,
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {templates.map((template) => (
        <Card
          key={template.id}
          className="hover:border-primary/40 flex flex-col gap-3 p-4 transition-colors"
        >
          <div>
            <h3 className="font-display text-sm uppercase">{template.name}</h3>
            <p className="text-muted-foreground mt-1.5 text-sm">
              {template.description}
            </p>
          </div>
          <div className="text-muted-foreground font-mono text-xs">
            {t("templateSelector.cellCount", {
              my: template.myAxis.levels.length,
              opp: template.opponentAxis.levels.length,
            })}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSelect(template)}
            className="mt-auto"
          >
            {t("templateSelector.use")}
          </Button>
        </Card>
      ))}
    </div>
  );
}
