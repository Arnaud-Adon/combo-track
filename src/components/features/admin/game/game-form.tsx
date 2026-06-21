"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
import { generateSlug } from "@/lib/slug";

interface GameFormProps {
  mode: "create" | "edit";
  game?: NonNullable<AdminGameDetail>;
}

export function GameForm({ mode, game }: GameFormProps) {
  const router = useRouter();
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");

  const { execute: createExecute, isPending: isCreating } = useAction(
    createGameAction,
    {
      onSuccess: () => {
        toast.success(t("game.toast.created"));
        router.push("/admin/games");
        router.refresh();
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? t("game.toast.createError"));
      },
    },
  );

  const { execute: updateExecute, isPending: isUpdating } = useAction(
    updateGameAction,
    {
      onSuccess: () => {
        toast.success(t("game.toast.updated"));
        router.push("/admin/games");
        router.refresh();
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? t("game.toast.updateError"));
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
              <FormLabel>{t("game.form.nameLabel")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("game.form.namePlaceholder")}
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
              <FormLabel>{t("game.form.slugLabel")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("game.form.slugPlaceholder")}
                />
              </FormControl>
              <FormDescription>{t("game.form.slugDescription")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="iconUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("game.form.iconUrlLabel")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder={t("game.form.iconUrlPlaceholder")}
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
            {tCommon("buttons.cancel")}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? mode === "create"
                ? t("game.form.creating")
                : t("game.form.updating")
              : mode === "create"
                ? t("game.form.createSubmit")
                : t("game.form.updateSubmit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
