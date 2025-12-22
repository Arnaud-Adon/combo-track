"use client";

import { Tag } from "@/../generated/prisma";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useVideoPlayerStore } from "@/stores/video-player";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createNoteAction } from "./note-action";
import { noteSchema, NoteSchemaType } from "./note-schema";

type NoteFormProps = {
  matchId: string;
  availableTags: Tag[];
};

export function NoteForm({ matchId, availableTags }: NoteFormProps) {
  const router = useRouter();
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const { execute, isPending, result } = useAction(createNoteAction, {
    onSuccess: () => {
      form.reset();
      setSelectedTagIds([]);
      router.refresh();
    },
  });

  const currentTime = useVideoPlayerStore((state) => state.currentTime);

  const form = useForm<NoteSchemaType>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      note: "",
      tagIds: [],
    },
  });

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) => {
      const newTagIds = prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : prev.length < 10
          ? [...prev, tagId]
          : prev;

      form.setValue("tagIds", newTagIds);
      return newTagIds;
    });
  };

  const onSubmit = (data: NoteSchemaType) => {
    execute({
      content: data.note,
      timestamp: currentTime,
      matchId: matchId,
      tagIds: data.tagIds,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Ajouter une note à ce moment de la vidéo..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormDescription>
                Votre note sera horodatée automatiquement
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <FormLabel>Tags ({selectedTagIds.length}/10)</FormLabel>
          <FormDescription>
            Sélectionnez les tags qui décrivent cette note
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
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
          {selectedTagIds.length === 0 && (
            <p className="text-sm text-destructive">
              Veuillez sélectionner au moins un tag
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isPending || selectedTagIds.length === 0}
        >
          {isPending ? "Ajout en cours..." : "Ajouter la note"}
        </Button>
        {result.serverError && (
          <p className="text-sm text-destructive mt-2">{result.serverError}</p>
        )}
      </form>
    </Form>
  );
}
