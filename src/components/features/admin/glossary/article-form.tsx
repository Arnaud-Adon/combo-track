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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import { articleFormSchema, ArticleFormSchemaType } from "./article-schema";
import { createArticleAction, updateArticleAction } from "./article-action";
import { MarkdownPreview } from "./markdown-preview";
import { AdminArticleDetail } from "@/../prisma/query/admin-glossary.query";

interface ArticleFormProps {
  mode: "create" | "edit";
  article?: NonNullable<AdminArticleDetail>;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function ArticleForm({ mode, article }: ArticleFormProps) {
  const router = useRouter();

  const { execute: createExecute, isPending: isCreating } = useAction(
    createArticleAction,
    {
      onSuccess: () => {
        toast.success("Article créé avec succès");
        router.push("/admin/glossary");
        router.refresh();
      },
      onError: ({ error }) => {
        toast.error(
          error.serverError ?? "Erreur lors de la création de l'article",
        );
      },
    },
  );

  const { execute: updateExecute, isPending: isUpdating } = useAction(
    updateArticleAction,
    {
      onSuccess: () => {
        toast.success("Article mis à jour avec succès");
        router.push("/admin/glossary");
        router.refresh();
      },
      onError: ({ error }) => {
        toast.error(
          error.serverError ?? "Erreur lors de la mise à jour de l'article",
        );
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
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Titre de l'article"
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
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="slug-de-l-article" />
                  </FormControl>
                  <FormDescription>
                    URL-friendly identifier (auto-généré depuis le titre)
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
                  <FormLabel>Catégorie</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex: Techniques, Personnages, Termes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extrait</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Court résumé de l'article (optionnel)"
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Affiché dans la liste des articles
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
                  <FormLabel>Contenu (Markdown)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Contenu de l'article en markdown..."
                      className="min-h-[300px] font-mono"
                    />
                  </FormControl>
                  <FormDescription>
                    Utilisez la syntaxe Markdown pour formater le contenu
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
                    <FormLabel>Publié</FormLabel>
                    <FormDescription>
                      Rendre cet article visible publiquement
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
              <h3 className="text-lg font-semibold">Prévisualisation</h3>
              <p className="text-muted-foreground text-sm">
                Aperçu du rendu markdown
              </p>
            </div>
            <MarkdownPreview content={content} />
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/glossary")}
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
                ? "Créer l'article"
                : "Mettre à jour"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
