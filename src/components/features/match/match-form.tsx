"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { matchFormSchema, MatchFormSchemaType } from "./match-schema";
import { createMatchAction } from "./match-action";

export function MatchForm() {
  const router = useRouter();

  const { execute, isPending } = useAction(createMatchAction, {
    onSuccess: ({ data }) => {
      toast.success("Match créé avec succès");
      router.push(`/videos/${data?.id}`);
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(
        error.serverError ?? "Erreur lors de la création du match",
      );
    },
  });

  const form = useForm<MatchFormSchemaType>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      videoUrl: "",
      title: "",
    },
  });

  const onSubmit = (data: MatchFormSchemaType) => {
    execute(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL YouTube</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </FormControl>
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
                <Input {...field} placeholder="Titre du match" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
            disabled={isPending}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Création..." : "Créer le replay"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
