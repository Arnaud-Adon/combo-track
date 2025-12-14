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
import { Textarea } from "@/components/ui/textarea";
import { useVideoPlayerStore } from "@/stores/video-player";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createNoteAction } from "./note-action";
import { noteSchema, NoteSchemaType } from "./note-schema";

type NoteFormProps = {
  matchId: string;
};

export function NoteForm({ matchId }: NoteFormProps) {
  const router = useRouter();

  const { execute, isPending, result } = useAction(createNoteAction, {
    onSuccess: () => {
      form.reset();
      router.refresh();
    },
  });

  const currentTime = useVideoPlayerStore((state) => state.currentTime);

  const form = useForm<NoteSchemaType>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      note: "",
    },
  });

  const onSubmit = (data: NoteSchemaType) => {
    execute({
      content: data.note,
      timestamp: currentTime,
      matchId: matchId,
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
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Ajout en cours..." : "Ajouter la note"}
        </Button>
        {result.serverError && (
          <p className="text-sm text-destructive mt-2">{result.serverError}</p>
        )}
      </form>
    </Form>
  );
}
