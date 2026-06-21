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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { articleFormSchema, ArticleFormSchemaType } from "./article-schema";
import { createArticleAction, updateArticleAction } from "./article-action";
import { MarkdownPreview } from "./markdown-preview";
import { ImageField } from "./image-field";
import { ContentField } from "./content-field";
import { AdminArticleDetail } from "@/../prisma/query/admin-glossary.query";
import { generateSlug } from "@/lib/slug";
import { useActionToast } from "@/hooks/use-action-toast";
import { EntityFormButtons } from "@/components/features/admin/shared/entity-form-buttons";

interface ArticleFormProps {
  mode: "create" | "edit";
  article?: NonNullable<AdminArticleDetail>;
}

export function ArticleForm({ mode, article }: ArticleFormProps) {
  const router = useRouter();
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");

  const { execute: createExecute, isPending: isCreating } = useActionToast(
    createArticleAction,
    {
      successMessage: t("article.toast.created"),
      errorMessage: t("article.toast.createError"),
      onSuccess: () => {
        router.push("/admin/glossary");
        router.refresh();
      },
    },
  );

  const { execute: updateExecute, isPending: isUpdating } = useActionToast(
    updateArticleAction,
    {
      successMessage: t("article.toast.updated"),
      errorMessage: t("article.toast.updateError"),
      onSuccess: () => {
        router.push("/admin/glossary");
        router.refresh();
      },
    },
  );

  const form = useForm<ArticleFormSchemaType>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: article?.title ?? "",
      slug: article?.slug ?? "",
      content: article?.content ?? "",
      excerpt: article?.excerpt ?? "",
      category: article?.category ?? "",
      image: article?.image ?? "",
      published: article?.published ?? false,
    },
  });

  const isPending = isCreating || isUpdating;
  const content = form.watch("content");

  const onSubmit = (data: ArticleFormSchemaType) => {
    if (mode === "create") {
      createExecute(data);
    } else {
      updateExecute({ ...data, id: article!.id });
    }
  };

  const handleTitleBlur = () => {
    const title = form.getValues("title");
    const slug = form.getValues("slug");

    // Auto-generate slug if empty
    if (title && !slug) {
      form.setValue("slug", generateSlug(title));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: Form Fields */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("article.form.titleLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("article.form.titlePlaceholder")}
                      onBlur={handleTitleBlur}
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
                  <FormLabel>{t("article.form.slugLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("article.form.slugPlaceholder")}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("article.form.slugDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("article.form.categoryLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("article.form.categoryPlaceholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("article.form.imageLabel")}</FormLabel>
                  <FormControl>
                    <ImageField
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("article.form.imageDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("article.form.excerptLabel")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      placeholder={t("article.form.excerptPlaceholder")}
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormDescription>
                    {t("article.form.excerptDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("article.form.contentLabel")}</FormLabel>
                  <FormControl>
                    <ContentField
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("article.form.contentDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>{t("article.form.publishedLabel")}</FormLabel>
                    <FormDescription>
                      {t("article.form.publishedDescription")}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Right: Markdown Preview */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">
                {t("article.form.previewTitle")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("article.form.previewSubtitle")}
              </p>
            </div>
            <MarkdownPreview content={content} />
          </div>
        </div>

        <EntityFormButtons
          mode={mode}
          isPending={isPending}
          onCancel={() => router.push("/admin/glossary")}
          cancelLabel={tCommon("buttons.cancel")}
          createLabel={t("article.form.createSubmit")}
          updateLabel={t("article.form.updateSubmit")}
          creatingLabel={t("article.form.creating")}
          updatingLabel={t("article.form.updating")}
        />
      </form>
    </Form>
  );
}
