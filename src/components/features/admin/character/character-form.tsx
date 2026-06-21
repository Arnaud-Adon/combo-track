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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  characterFormSchema,
  CharacterFormSchemaType,
} from "./character-schema";
import {
  createCharacterAction,
  updateCharacterAction,
} from "./character-action";
import { AdminCharacterDetail } from "@/../prisma/query/admin-character.query";
import { GameOption } from "@/../prisma/query/game.query";
import { generateSlug } from "@/lib/slug";
import { useActionToast } from "@/hooks/use-action-toast";
import { EntityFormButtons } from "@/components/features/admin/shared/entity-form-buttons";

interface CharacterFormProps {
  mode: "create" | "edit";
  character?: NonNullable<AdminCharacterDetail>;
  games: GameOption[];
}

export function CharacterForm({ mode, character, games }: CharacterFormProps) {
  const router = useRouter();
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");

  const { execute: createExecute, isPending: isCreating } = useActionToast(
    createCharacterAction,
    {
      successMessage: t("character.toast.created"),
      errorMessage: t("character.toast.createError"),
      onSuccess: () => {
        router.push("/admin/characters");
        router.refresh();
      },
    },
  );

  const { execute: updateExecute, isPending: isUpdating } = useActionToast(
    updateCharacterAction,
    {
      successMessage: t("character.toast.updated"),
      errorMessage: t("character.toast.updateError"),
      onSuccess: () => {
        router.push("/admin/characters");
        router.refresh();
      },
    },
  );

  const form = useForm<CharacterFormSchemaType>({
    resolver: zodResolver(characterFormSchema),
    defaultValues: {
      gameId: character?.gameId ?? "",
      name: character?.name ?? "",
      slug: character?.slug ?? "",
      iconUrl: character?.iconUrl ?? "",
    },
  });

  const isPending = isCreating || isUpdating;

  const onSubmit = (data: CharacterFormSchemaType) => {
    if (mode === "create") {
      createExecute(data);
    } else {
      updateExecute({ ...data, id: character!.id });
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-xl space-y-6"
      >
        <FormField
          control={form.control}
          name="gameId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("character.form.gameLabel")}</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("character.form.gamePlaceholder")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {games.map((game) => (
                    <SelectItem key={game.id} value={game.id}>
                      {game.name}
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("character.form.nameLabel")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("character.form.namePlaceholder")}
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
              <FormLabel>{t("character.form.slugLabel")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("character.form.slugPlaceholder")}
                />
              </FormControl>
              <FormDescription>
                {t("character.form.slugDescription")}
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
              <FormLabel>{t("character.form.iconUrlLabel")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder={t("character.form.iconUrlPlaceholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <EntityFormButtons
          mode={mode}
          isPending={isPending}
          onCancel={() => router.push("/admin/characters")}
          cancelLabel={tCommon("buttons.cancel")}
          createLabel={t("character.form.createSubmit")}
          updateLabel={t("character.form.updateSubmit")}
          creatingLabel={t("character.form.creating")}
          updatingLabel={t("character.form.updating")}
        />
      </form>
    </Form>
  );
}
