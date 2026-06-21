"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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

import { gameFormSchema, GameFormSchemaType } from "./game-schema";
import { createGameAction, updateGameAction } from "./game-action";
import { AdminGameDetail } from "@/../prisma/query/admin-game.query";
import { generateSlug } from "@/lib/slug";
import { useActionToast } from "@/hooks/use-action-toast";
import { EntityFormButtons } from "@/components/features/admin/shared/entity-form-buttons";

interface GameFormProps {
  mode: "create" | "edit";
  game?: NonNullable<AdminGameDetail>;
}

export function GameForm({ mode, game }: GameFormProps) {
  const router = useRouter();
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");

  const { execute: createExecute, isPending: isCreating } = useActionToast(
    createGameAction,
    {
      successMessage: t("game.toast.created"),
      errorMessage: t("game.toast.createError"),
      onSuccess: () => {
        router.push("/admin/games");
        router.refresh();
      },
    },
  );

  const { execute: updateExecute, isPending: isUpdating } = useActionToast(
    updateGameAction,
    {
      successMessage: t("game.toast.updated"),
      errorMessage: t("game.toast.updateError"),
      onSuccess: () => {
        router.push("/admin/games");
        router.refresh();
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

        <EntityFormButtons
          mode={mode}
          isPending={isPending}
          onCancel={() => router.push("/admin/games")}
          cancelLabel={tCommon("buttons.cancel")}
          createLabel={t("game.form.createSubmit")}
          updateLabel={t("game.form.updateSubmit")}
          creatingLabel={t("game.form.creating")}
          updatingLabel={t("game.form.updating")}
        />
      </form>
    </Form>
  );
}
