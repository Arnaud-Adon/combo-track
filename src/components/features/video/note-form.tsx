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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { cn } from "@/lib/utils";
import { useVideoPlayerStore } from "@/stores/video-player";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mic, MicOff, Sparkles } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createNoteAction } from "./note-action";
import { noteSchema, NoteSchemaType } from "./note-schema";
import { suggestTagsAction } from "./suggest-tags-action";

type NoteFormProps = {
  matchId: string;
  availableTags: Tag[];
};

export function NoteForm({ matchId, availableTags }: NoteFormProps) {
  const router = useRouter();
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [suggestedTagIds, setSuggestedTagIds] = useState<string[]>([]);

  const {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    error: speechError,
    start: startListening,
    stop: stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const { execute, isPending, result } = useAction(createNoteAction, {
    onSuccess: () => {
      form.reset();
      setSelectedTagIds([]);
      setSuggestedTagIds([]);
      resetTranscript();
      router.refresh();
    },
  });

  const { execute: executeSuggest, isPending: isSuggesting } = useAction(
    suggestTagsAction,
    {
      onSuccess: ({ data }) => {
        if (!data?.suggestedTags) return;
        const ids = availableTags
          .filter((tag) => data.suggestedTags.includes(tag.name))
          .map((tag) => tag.id);
        setSuggestedTagIds(ids);
      },
    },
  );

  const currentTime = useVideoPlayerStore((state) => state.currentTime);

  const form = useForm<NoteSchemaType>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      note: "",
      tagIds: [],
    },
  });

  const noteValue = form.watch("note");

  useEffect(() => {
    if (transcript) {
      form.setValue("note", transcript, { shouldDirty: true, shouldValidate: true });
    }
  }, [transcript, form]);

  useEffect(() => {
    if (speechError) {
      toast.error(speechError);
    }
  }, [speechError]);

  const handleToggleRecording = () => {
    if (!isSupported) {
      toast.error("Votre navigateur ne supporte pas la reconnaissance vocale");
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

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

  const handleSuggestTags = () => {
    const noteText = form.getValues("note");
    if (noteText.length < 10) return;
    executeSuggest({
      noteText,
      availableTagNames: availableTags.map((t) => t.name),
    });
  };

  const handleAcceptAllSuggestions = () => {
    const unselected = suggestedTagIds.filter(
      (id) => !selectedTagIds.includes(id),
    );
    const newTagIds = [...selectedTagIds, ...unselected].slice(0, 10);
    setSelectedTagIds(newTagIds);
    form.setValue("tagIds", newTagIds);
    setSuggestedTagIds([]);
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
              <div className="flex items-center justify-between">
                <FormLabel>Note</FormLabel>
                {isSupported && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleToggleRecording}
                        className={cn(
                          "h-8 w-8",
                          isListening && "text-destructive animate-pulse",
                        )}
                        aria-label={
                          isListening
                            ? "Arrêter la dictée vocale"
                            : "Démarrer la dictée vocale"
                        }
                      >
                        {isListening ? (
                          <MicOff className="h-4 w-4" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isListening
                        ? "Arrêter la dictée vocale"
                        : "Dicter une note"}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Ajouter une note à ce moment de la vidéo..."
                  className="min-h-[100px]"
                />
              </FormControl>
              {isListening && interimTranscript && (
                <p className="text-muted-foreground text-xs italic">
                  {interimTranscript}
                </p>
              )}
              <FormDescription>
                Votre note sera horodatée automatiquement
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FormLabel>Tags ({selectedTagIds.length}/10)</FormLabel>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSuggestTags}
                    disabled={isSuggesting || noteValue.length < 10}
                  >
                    {isSuggesting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    {isSuggesting
                      ? "Suggestion en cours..."
                      : "Suggérer des tags"}
                  </Button>
                </span>
              </TooltipTrigger>
              {noteValue.length < 10 && (
                <TooltipContent>
                  La note doit contenir au moins 10 caractères
                </TooltipContent>
              )}
            </Tooltip>
          </div>
          <FormDescription>
            Sélectionnez les tags qui décrivent cette note
          </FormDescription>
          {suggestedTagIds.length > 0 && (
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground text-xs">
                Tags suggérés par l&apos;IA
              </p>
              <button
                type="button"
                onClick={handleAcceptAllSuggestions}
                className="text-primary text-xs underline"
              >
                Tout accepter
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id);
              const isSuggested =
                !isSelected && suggestedTagIds.includes(tag.id);
              const isDisabled =
                !isSelected && !isSuggested && selectedTagIds.length >= 10;

              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    toggleTag(tag.id);
                    setSuggestedTagIds((prev) =>
                      prev.filter((id) => id !== tag.id),
                    );
                  }}
                  disabled={isDisabled}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : isSuggested
                        ? "bg-secondary text-secondary-foreground ring-primary/50 ring-2"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                    isDisabled && "cursor-not-allowed opacity-50",
                  )}
                >
                  {isSuggested && <Sparkles className="mr-1 inline h-3 w-3" />}
                  {tag.name}
                </button>
              );
            })}
          </div>
          {selectedTagIds.length === 0 && (
            <p className="text-destructive text-sm">
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
          <p className="text-destructive mt-2 text-sm">{result.serverError}</p>
        )}
      </form>
    </Form>
  );
}
