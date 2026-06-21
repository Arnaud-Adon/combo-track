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

interface CharacterFormProps {
  mode: "create" | "edit";
  character?: NonNullable<AdminCharacterDetail>;
  games: GameOption[];
}

export function CharacterForm({ mode, character, games }: CharacterFormProps) {
  const router = useRouter();
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");

  const { execute: createExecute, isPending: isCreating } = useAction(
    createCharacterAction,
    {
      onSuccess: () => {
        toast.success(t("character.toast.created"));
        router.push("/admin/characters");
        router.refresh();
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? t("character.toast.createError"));
      },
    },
  );

  const { execute: updateExecute, isPending: isUpdating } = useAction(
    updateCharacterAction,
    {
      onSuccess: () => {
        toast.success(t("character.toast.updated"));
        router.push("/admin/characters");
        router.refresh();
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? t("character.toast.updateError"));
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

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/characters")}
            disabled={isPending}
          >
            {tCommon("buttons.cancel")}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? mode === "create"
                ? t("character.form.creating")
                : t("character.form.updating")
              : mode === "create"
                ? t("character.form.createSubmit")
                : t("character.form.updateSubmit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
