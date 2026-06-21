"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type {
  CharacterOption,
  GameOption,
} from "../../../../prisma/query/strategy-matrix.query";
import {
  createStrategyMatrixAction,
  updateStrategyMatrixAction,
} from "./strategy-matrix-action";
import { FrameLegend } from "./frame-legend";
import { StrategyMatrixAiFillButton } from "./strategy-matrix-ai-fill-button";
import { StrategyMatrixAxisBuilder } from "./strategy-matrix-axis-builder";
import { StrategyMatrixCellEditor } from "./strategy-matrix-cell-editor";
import { StrategyMatrixGrid } from "./strategy-matrix-grid";
import { StrategyMatrixMatchupSelector } from "./strategy-matrix-matchup-selector";
import {
  strategyMatrixCreateSchema,
  type Axis,
  type StrategyMatrixCreateInput,
} from "./strategy-matrix-schema";
import {
  resolveStrategyMatrixTemplates,
  type StrategyMatrixTemplate,
  type TemplateTranslator,
} from "./strategy-matrix-templates";
import { StrategyMatrixTemplateSelector } from "./strategy-matrix-template-selector";
import {
  buildCellLookup,
  cellKey,
  reconcileCells,
} from "./strategy-matrix-types";

type CommonProps = {
  games: GameOption[];
  charactersByGame: Record<string, CharacterOption[]>;
};

type Props = CommonProps &
  (
    | {
        mode: "create";
        initialTemplate?: StrategyMatrixTemplate;
        matrixId?: undefined;
        initialData?: undefined;
      }
    | {
        mode: "edit";
        matrixId: string;
        initialData: StrategyMatrixCreateInput;
        initialTemplate?: undefined;
      }
  );

type EditingCell = {
  myLevelId: string;
  opponentLevelId: string;
} | null;

type MatrixSectionProps = {
  index: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

function MatrixSection(props: MatrixSectionProps) {
  const { index, title, description, action, children } = props;

  return (
    <section className="border-border bg-card rounded-xl border p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-primary font-mono text-xs">{index}</span>
            <h2 className="font-display text-lg uppercase">{title}</h2>
          </div>
          {description && (
            <p className="text-muted-foreground mt-1.5 text-sm">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function StrategyMatrixForm(props: Props) {
  const router = useRouter();
  const t = useTranslations("strategyMatrix");
  const tc = useTranslations("common");
  const templates = resolveStrategyMatrixTemplates(
    t as unknown as TemplateTranslator,
  );
  const fallback = props.initialTemplate ?? templates[0];
  const initialValues: StrategyMatrixCreateInput =
    props.mode === "edit"
      ? props.initialData
      : {
          title: fallback.title,
          description: undefined,
          gameId: undefined,
          myCharacterId: undefined,
          opponentCharacterId: undefined,
          myAxis: fallback.myAxis,
          opponentAxis: fallback.opponentAxis,
          cells: fallback.cells,
        };

  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [editingCell, setEditingCell] = useState<EditingCell>(null);

  const form = useForm<StrategyMatrixCreateInput>({
    resolver: zodResolver(strategyMatrixCreateSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  const myAxis = form.watch("myAxis");
  const opponentAxis = form.watch("opponentAxis");
  const cells = form.watch("cells");
  const gameId = form.watch("gameId");
  const myCharacterId = form.watch("myCharacterId");
  const opponentCharacterId = form.watch("opponentCharacterId");

  const createAction = useAction(createStrategyMatrixAction, {
    onSuccess: ({ data }) => {
      toast.success(t("form.toast.created"));
      if (data?.id) router.push(`/notes/strategy/${data.id}`);
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? t("form.toast.createError"));
    },
  });

  const updateAction = useAction(updateStrategyMatrixAction, {
    onSuccess: () => {
      toast.success(t("form.toast.updated"));
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? t("form.toast.updateError"));
    },
  });

  const isPending = createAction.isPending || updateAction.isPending;

  const handleSelectTemplate = (template: StrategyMatrixTemplate) => {
    form.reset({
      title: template.title,
      description: undefined,
      gameId,
      myCharacterId,
      opponentCharacterId,
      myAxis: template.myAxis,
      opponentAxis: template.opponentAxis,
      cells: template.cells,
    });
    setShowTemplatePicker(false);
  };

  const handleMatchupChange = (next: {
    gameId?: string;
    myCharacterId?: string;
    opponentCharacterId?: string;
  }) => {
    form.setValue("gameId", next.gameId, { shouldDirty: true });
    form.setValue("myCharacterId", next.myCharacterId, { shouldDirty: true });
    form.setValue("opponentCharacterId", next.opponentCharacterId, {
      shouldDirty: true,
    });
  };

  const handleAxisChange = (
    field: "myAxis" | "opponentAxis",
    nextAxis: Axis,
  ) => {
    form.setValue(field, nextAxis, { shouldDirty: true });
    const nextMy = field === "myAxis" ? nextAxis : myAxis;
    const nextOpp = field === "opponentAxis" ? nextAxis : opponentAxis;
    const nextCells = reconcileCells(form.getValues("cells"), nextMy, nextOpp);
    form.setValue("cells", nextCells, { shouldDirty: true });
  };

  const handleCellSave = (content: string) => {
    if (!editingCell) return;
    const lookup = buildCellLookup(form.getValues("cells"));
    const key = cellKey(editingCell.myLevelId, editingCell.opponentLevelId);
    lookup.set(key, {
      myLevelId: editingCell.myLevelId,
      opponentLevelId: editingCell.opponentLevelId,
      content,
    });
    form.setValue("cells", Array.from(lookup.values()), { shouldDirty: true });
  };

  const handleAiCellsGenerated = (
    generated: {
      myLevelId: string;
      opponentLevelId: string;
      content: string;
    }[],
  ) => {
    const lookup = buildCellLookup(form.getValues("cells"));
    for (const cell of generated) {
      lookup.set(cellKey(cell.myLevelId, cell.opponentLevelId), cell);
    }
    form.setValue("cells", Array.from(lookup.values()), { shouldDirty: true });
  };

  const onSubmit = (data: StrategyMatrixCreateInput) => {
    const reconciled = reconcileCells(
      data.cells,
      data.myAxis,
      data.opponentAxis,
    );
    const payload = { ...data, cells: reconciled };
    if (props.mode === "edit") {
      updateAction.execute({ id: props.matrixId, ...payload });
    } else {
      createAction.execute(payload);
    }
  };

  const editingMyLabel = editingCell
    ? (myAxis.levels.find((l) => l.id === editingCell.myLevelId)?.label ?? "")
    : "";
  const editingOppLabel = editingCell
    ? (opponentAxis.levels.find((l) => l.id === editingCell.opponentLevelId)
        ?.label ?? "")
    : "";
  const editingContent = editingCell
    ? (cells.find(
        (c) =>
          c.myLevelId === editingCell.myLevelId &&
          c.opponentLevelId === editingCell.opponentLevelId,
      )?.content ?? "")
    : "";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {props.mode === "create" && (
          <MatrixSection
            index="00"
            title={t("form.template.title")}
            description={t("form.template.description")}
          >
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowTemplatePicker((v) => !v)}
              >
                {showTemplatePicker
                  ? t("form.template.hide")
                  : t("form.template.show")}
              </Button>
              {showTemplatePicker && (
                <StrategyMatrixTemplateSelector
                  onSelect={handleSelectTemplate}
                />
              )}
            </div>
          </MatrixSection>
        )}

        <MatrixSection
          index="01"
          title={t("form.identity.title")}
          description={t("form.identity.description")}
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.titleLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.titlePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.descriptionLabel")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("form.descriptionPlaceholder")}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      className="min-h-[60px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </MatrixSection>

        <MatrixSection
          index="02"
          title={t("form.matchup.title")}
          description={t("form.matchup.description")}
        >
          <StrategyMatrixMatchupSelector
            games={props.games}
            charactersByGame={props.charactersByGame}
            value={{ gameId, myCharacterId, opponentCharacterId }}
            onChange={handleMatchupChange}
          />
        </MatrixSection>

        <MatrixSection
          index="03"
          title={t("form.axes.title")}
          description={t("form.axes.description")}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <StrategyMatrixAxisBuilder
              tone="mine"
              heading={t("form.axes.mine")}
              axis={myAxis}
              onChange={(next) => handleAxisChange("myAxis", next)}
            />
            <StrategyMatrixAxisBuilder
              tone="opponent"
              heading={t("form.axes.opponent")}
              axis={opponentAxis}
              onChange={(next) => handleAxisChange("opponentAxis", next)}
            />
          </div>
        </MatrixSection>

        <MatrixSection
          index="04"
          title={t("form.grid.title")}
          description={t("form.grid.description")}
          action={
            <StrategyMatrixAiFillButton
              title={form.watch("title")}
              description={form.watch("description")}
              gameId={gameId}
              myCharacterId={myCharacterId}
              opponentCharacterId={opponentCharacterId}
              myAxis={myAxis}
              opponentAxis={opponentAxis}
              cells={cells}
              onCellsGenerated={handleAiCellsGenerated}
            />
          }
        >
          <div className="space-y-3">
            <FrameLegend />
            <StrategyMatrixGrid
              myAxis={myAxis}
              opponentAxis={opponentAxis}
              cells={cells}
              onCellClick={(myLevelId, opponentLevelId) =>
                setEditingCell({ myLevelId, opponentLevelId })
              }
            />
          </div>
        </MatrixSection>

        <div className="border-border bg-background/80 sticky bottom-0 z-10 flex items-center justify-end gap-2 rounded-xl border px-4 py-3 backdrop-blur">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            {tc("buttons.cancel")}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? t("form.submitting")
              : props.mode === "edit"
                ? t("form.submitEdit")
                : t("form.submitCreate")}
          </Button>
        </div>

        <StrategyMatrixCellEditor
          open={editingCell !== null}
          onOpenChange={(open) => !open && setEditingCell(null)}
          initialContent={editingContent}
          myLevelLabel={editingMyLabel}
          opponentLevelLabel={editingOppLabel}
          onSave={handleCellSave}
        />
      </form>
    </Form>
  );
}
