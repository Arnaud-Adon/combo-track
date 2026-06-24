"use client";

import { RichMarkdownEditor } from "@/components/features/editor/rich-markdown-editor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useActionToast } from "@/hooks/use-action-toast";
import { createMemoAction, updateMemoAction } from "./memo-action";
import {
  MAX_MEMO_CONTENT_LENGTH,
  memoFormSchema,
  type MemoFormInput,
} from "./memo-schema";

type Props =
  | {
      mode: "create";
      memoId?: undefined;
      initialData?: undefined;
    }
  | {
      mode: "edit";
      memoId: string;
      initialData: MemoFormInput;
    };

export function MemoForm(props: Props) {
  const router = useRouter();
  const t = useTranslations("memo.form");
  const tCommon = useTranslations("common.buttons");

  const form = useForm<MemoFormInput>({
    resolver: zodResolver(memoFormSchema),
    defaultValues:
      props.mode === "edit" ? props.initialData : { title: "", content: "" },
    mode: "onSubmit",
  });

  const createAction = useActionToast(createMemoAction, {
    successMessage: t("created"),
    errorMessage: t("createError"),
    onSuccess: ({ data }) => {
      if (data?.id) router.push(`/notes/memo/${data.id}`);
    },
  });

  const updateAction = useActionToast(updateMemoAction, {
    successMessage: t("updated"),
    errorMessage: t("updateError"),
    onSuccess: () => {
      router.refresh();
    },
  });

  const isPending = createAction.isPending || updateAction.isPending;

  const onSubmit = (data: MemoFormInput) => {
    if (props.mode === "edit") {
      updateAction.execute({ id: props.memoId, ...data });
    } else {
      createAction.execute(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("titleLabel")}</FormLabel>
              <FormControl>
                <Input placeholder={t("titlePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contentLabel")}</FormLabel>
              <FormControl>
                <RichMarkdownEditor
                  {...field}
                  maxLength={MAX_MEMO_CONTENT_LENGTH}
                  placeholder={t("contentPlaceholder")}
                  ariaLabel={t("contentLabel")}
                  className="min-h-[240px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            {tCommon("cancel")}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? t("saving")
              : props.mode === "edit"
                ? t("update")
                : t("create")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
