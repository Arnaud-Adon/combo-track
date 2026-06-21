"use client";

import { notationComponents } from "@/components/features/notation/notation-renderer";
import { NotationToolbar } from "@/components/features/notation/notation-toolbar";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Pencil } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
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
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<MemoFormInput>({
    resolver: zodResolver(memoFormSchema),
    defaultValues:
      props.mode === "edit" ? props.initialData : { title: "", content: "" },
    mode: "onSubmit",
  });

  const createAction = useAction(createMemoAction, {
    onSuccess: ({ data }) => {
      toast.success(t("created"));
      if (data?.id) router.push(`/notes/memo/${data.id}`);
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? t("createError"));
    },
  });

  const updateAction = useAction(updateMemoAction, {
    onSuccess: () => {
      toast.success(t("updated"));
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? t("updateError"));
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
              <div className="flex items-center justify-between">
                <FormLabel>{t("contentLabel")}</FormLabel>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">
                    {field.value.length} / {MAX_MEMO_CONTENT_LENGTH}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview((v) => !v)}
                  >
                    {showPreview ? (
                      <>
                        <Pencil className="mr-2 h-3 w-3" />
                        {t("edit")}
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-3 w-3" />
                        {t("preview")}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {!showPreview && (
                <NotationToolbar
                  textareaRef={textareaRef}
                  value={field.value}
                  onValueChange={(next) => field.onChange(next)}
                  maxLength={MAX_MEMO_CONTENT_LENGTH}
                />
              )}

              <FormControl>
                {showPreview ? (
                  <div className="prose prose-invert border-border bg-muted text-foreground min-h-[200px] max-w-none rounded-md border p-3 text-sm">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={notationComponents}
                    >
                      {field.value || t("emptyPreview")}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <Textarea
                    ref={textareaRef}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.slice(0, MAX_MEMO_CONTENT_LENGTH),
                      )
                    }
                    placeholder={t("contentPlaceholder")}
                    className="min-h-[240px]"
                  />
                )}
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
