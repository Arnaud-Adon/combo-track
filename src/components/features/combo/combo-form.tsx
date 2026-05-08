"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Tag } from "@/../generated/prisma";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { comboFormSchema, ComboFormSchemaType } from "./combo-schema";
import { createComboAction, updateComboAction } from "./combo-action";
import { ComboDetail } from "@/../prisma/query/combo.query";

type CharacterOption = {
  id: string;
  slug: string;
  name: string;
  iconUrl: string | null;
  game: { id: string; slug: string; name: string };
};

interface ComboFormProps {
  mode: "create" | "edit";
  combo?: ComboDetail;
  characters: CharacterOption[];
  availableTags: Tag[];
  defaultCharacterId?: string;
  sourceNoteId?: string;
  prefillContent?: string;
}

export function ComboForm({
  mode,
  combo,
  characters,
  availableTags,
  defaultCharacterId,
  sourceNoteId,
  prefillContent,
}: ComboFormProps) {
  const router = useRouter();

  const initialTagIds = combo?.tags.map((t) => t.id) ?? [];
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialTagIds);

  const initialCharacter = combo?.character.id
    ? characters.find((c) => c.id === combo.character.id)
    : defaultCharacterId
      ? characters.find((c) => c.id === defaultCharacterId)
      : undefined;

  const [selectedGameId, setSelectedGameId] = useState<string>(
    initialCharacter?.game.id ?? "",
  );

  const games = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    for (const character of characters) {
      if (!map.has(character.game.id)) {
        map.set(character.game.id, {
          id: character.game.id,
          name: character.game.name,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [characters]);

  const charactersForGame = useMemo(
    () =>
      characters
        .filter((character) => character.game.id === selectedGameId)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [characters, selectedGameId],
  );

  const { execute: createExecute, isPending: isCreating } = useAction(
    createComboAction,
    {
      onSuccess: () => {
        toast.success("Combo créé avec succès");
        router.push("/combos");
        router.refresh();
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "Erreur lors de la création du combo");
      },
    },
  );

  const { execute: updateExecute, isPending: isUpdating } = useAction(
    updateComboAction,
    {
      onSuccess: () => {
        toast.success("Combo mis à jour avec succès");
        router.push(`/combos/${combo!.id}`);
        router.refresh();
      },
      onError: ({ error }) => {
        toast.error(
          error.serverError ?? "Erreur lors de la mise à jour du combo",
        );
      },
    },
  );

  const form = useForm<ComboFormSchemaType>({
    resolver: zodResolver(comboFormSchema),
    defaultValues: {
      characterId: combo?.character.id ?? defaultCharacterId ?? "",
      title: combo?.title ?? "",
      notation: combo?.notation ?? prefillContent ?? "",
      damage: combo?.damage ?? undefined,
      meterUsed: combo?.meterUsed ?? undefined,
      difficulty: combo?.difficulty ?? undefined,
      notes: combo?.notes ?? "",
      tagIds: initialTagIds,
      sourceNoteId: combo?.sourceNoteId ?? sourceNoteId,
    },
  });

  const isPending = isCreating || isUpdating;

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) => {
      const next = prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : prev.length < 10
          ? [...prev, tagId]
          : prev;
      form.setValue("tagIds", next, { shouldValidate: true });
      return next;
    });
  };

  const onSubmit = (data: ComboFormSchemaType) => {
    if (mode === "create") {
      createExecute(data);
    } else {
      updateExecute({ ...data, id: combo!.id });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl space-y-6"
      >
        <FormItem>
          <FormLabel>Jeu</FormLabel>
          <Select
            value={selectedGameId}
            onValueChange={(value) => {
              setSelectedGameId(value);
              form.setValue("characterId", "", { shouldValidate: true });
            }}
            disabled={isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un jeu" />
            </SelectTrigger>
            <SelectContent>
              {games.map((game) => (
                <SelectItem key={game.id} value={game.id}>
                  {game.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>

        <FormField
          control={form.control}
          name="characterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personnage</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) =>
                  form.setValue("characterId", value, { shouldValidate: true })
                }
                disabled={isPending || !selectedGameId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        selectedGameId
                          ? "Sélectionner un personnage"
                          : "Sélectionnez un jeu d'abord"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {charactersForGame.map((character) => (
                    <SelectItem key={character.id} value={character.id}>
                      {character.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex : Bread and butter midscreen"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notation</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Ex : 2MP > 2HP xx 236P, SA1"
                  className="min-h-[100px] font-mono"
                />
              </FormControl>
              <FormDescription>
                Utilisez la notation FGC habituelle (numpad ou directionnelle)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="damage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dégâts</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={9999}
                    placeholder="3500"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="meterUsed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jauge utilisée</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    placeholder="1"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulté (1-5)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    placeholder="3"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optionnel)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Détails, conditions, alternatives..."
                  className="min-h-[80px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <FormLabel>Tags ({selectedTagIds.length}/10)</FormLabel>
          <FormDescription>
            Sélectionnez les tags qui décrivent ce combo
          </FormDescription>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id);
              const isDisabled = !isSelected && selectedTagIds.length >= 10;
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  disabled={isDisabled}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                    isDisabled && "cursor-not-allowed opacity-50",
                  )}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4">
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
              ? mode === "create"
                ? "Création..."
                : "Mise à jour..."
              : mode === "create"
                ? "Créer le combo"
                : "Mettre à jour"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
