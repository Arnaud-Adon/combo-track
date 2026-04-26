"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { Button } from "@/components/ui/button";

import { gameFormSchema, GameFormSchemaType } from "./game-schema";
import { createGameAction, updateGameAction } from "./game-action";
import { AdminGameDetail } from "@/../prisma/query/admin-game.query";

interface GameFormProps {
  mode: "create" | "edit";
  game?: NonNullable<AdminGameDetail>;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function GameForm({ mode, game }: GameFormProps) {
  const router = useRouter();

  const { execute: createExecute, isPending: isCreating } = useAction(
    createGameAction,
    {
      onSuccess: () => {
        toast.success("Jeu créé avec succès");
        router.push("/admin/games");
        router.refresh();
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "Erreur lors de la création du jeu");
      },
    },
  );

  const { execute: updateExecute, isPending: isUpdating } = useAction(
    updateGameAction,
    {
      onSuccess: () => {
        toast.success("Jeu mis à jour avec succès");
        router.push("/admin/games");
        router.refresh();
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? "Erreur lors de la mise à jour du jeu");
      },
    },
  );

  const form = useForm<GameFormSchemaType>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      name: game?.name ?? "",
      slug: game?.slug ?? "",
      iconUrl: game?.iconUrl ?? "",
    },
  });

  const isPending = isCreating || isUpdating;

  const onSubmit = (data: GameFormSchemaType) => {
    if (mode === "create") {
      createExecute(data);
    } else {
      updateExecute({ ...data, id: game!.id });
    }
  };

  const handleNameBlur = () => {
    const name = form.getValues("name");
    const slug = form.getValues("slug");
    if (name && !slug) {
      form.setValue("slug", generateSlug(name));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex : Street Fighter 6"
                  onBlur={handleNameBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} placeholder="street-fighter-6" />
              </FormControl>
              <FormDescription>
                Identifiant URL-friendly (auto-généré depuis le nom)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="iconUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de l&apos;icône (optionnel)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="https://..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/games")}
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
                ? "Créer le jeu"
                : "Mettre à jour"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
