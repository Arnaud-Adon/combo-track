"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  STRATEGY_MATRIX_TEMPLATES,
  type StrategyMatrixTemplate,
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

export function StrategyMatrixForm(props: Props) {
  const router = useRouter();
  const fallback = props.initialTemplate ?? STRATEGY_MATRIX_TEMPLATES[0];
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
      toast.success("Matrice créée");
      if (data?.id) router.push(`/notes/strategy/${data.id}`);
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Erreur lors de la création");
    },
  });

  const updateAction = useAction(updateStrategyMatrixAction, {
    onSuccess: () => {
      toast.success("Matrice mise à jour");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Erreur lors de la mise à jour");
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
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowTemplatePicker((v) => !v)}
            >
              {showTemplatePicker ? "Masquer les modèles" : "Choisir un modèle"}
            </Button>
            {showTemplatePicker && (
              <StrategyMatrixTemplateSelector onSelect={handleSelectTemplate} />
            )}
          </div>
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Stratégie défensive Ken" {...field} />
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
              <FormLabel>Description (optionnelle)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Contexte ou conditions générales d'utilisation de cette matrice"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  className="min-h-[60px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <StrategyMatrixMatchupSelector
          games={props.games}
          charactersByGame={props.charactersByGame}
          value={{ gameId, myCharacterId, opponentCharacterId }}
          onChange={handleMatchupChange}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <StrategyMatrixAxisBuilder
            heading="Mon état (colonnes)"
            axis={myAxis}
            onChange={(next) => handleAxisChange("myAxis", next)}
          />
          <StrategyMatrixAxisBuilder
            heading="État adversaire (lignes)"
            axis={opponentAxis}
            onChange={(next) => handleAxisChange("opponentAxis", next)}
          />
        </div>

        <div className="space-y-2">
          <FormLabel>Matrice</FormLabel>
          <FormDescription>
            Cliquez sur une cellule pour éditer son contenu en markdown.
          </FormDescription>
          <StrategyMatrixGrid
            myAxis={myAxis}
            opponentAxis={opponentAxis}
            cells={cells}
            onCellClick={(myLevelId, opponentLevelId) =>
              setEditingCell({ myLevelId, opponentLevelId })
            }
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Enregistrement…"
              : props.mode === "edit"
                ? "Mettre à jour"
                : "Créer la matrice"}
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
