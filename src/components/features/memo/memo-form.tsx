"use client";

import { frameDataComponents } from "@/components/features/strategy-matrix/frame-data-renderer";
import {
  FGC_ACTIONS,
  FGC_BUTTONS,
  FGC_POSITIONS,
  FRAME_OPTIONS,
} from "@/components/features/strategy-matrix/strategy-matrix-types";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Pencil } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
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
  const [showPreview, setShowPreview] = useState(false);
  const [notationKey, setNotationKey] = useState(0);
  const [frameKey, setFrameKey] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<MemoFormInput>({
    resolver: zodResolver(memoFormSchema),
    defaultValues:
      props.mode === "edit"
        ? props.initialData
        : { title: "", content: "" },
    mode: "onSubmit",
  });

  const content = form.watch("content");

  const createAction = useAction(createMemoAction, {
    onSuccess: ({ data }) => {
      toast.success("Mémo créé");
      if (data?.id) router.push(`/notes/memo/${data.id}`);
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Erreur lors de la création");
    },
  });

  const updateAction = useAction(updateMemoAction, {
    onSuccess: () => {
      toast.success("Mémo mis à jour");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Erreur lors de la mise à jour");
    },
  });

  const isPending = createAction.isPending || updateAction.isPending;

  const insertAtCursor = (text: string, cursorOffset?: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.slice(0, start);
    const after = content.slice(end);
    const newContent = (before + text + after).slice(0, MAX_MEMO_CONTENT_LENGTH);

    form.setValue("content", newContent, { shouldDirty: true });

    const newCursorPos =
      cursorOffset !== undefined ? start + cursorOffset : start + text.length;

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    });
  };

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
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Punish maxi sur DI bloqué" {...field} />
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
                <FormLabel>Contenu</FormLabel>
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
                        Édition
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-3 w-3" />
                        Aperçu
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {!showPreview && (
                <div className="flex items-center gap-2">
                  <Select
                    key={`notation-${notationKey}`}
                    onValueChange={(v) => {
                      insertAtCursor(v);
                      setNotationKey((k) => k + 1);
                    }}
                  >
                    <SelectTrigger size="sm" className="w-auto text-xs">
                      <SelectValue placeholder="Notation..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Positions</SelectLabel>
                        {FGC_POSITIONS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Boutons</SelectLabel>
                        {FGC_BUTTONS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Actions</SelectLabel>
                        {FGC_ACTIONS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Select
                    key={`frame-${frameKey}`}
                    onValueChange={(v) => {
                      const option = FRAME_OPTIONS.find((o) => o.value === v);
                      const offset =
                        option && "cursorOffset" in option
                          ? (option as { cursorOffset: number }).cursorOffset
                          : undefined;
                      insertAtCursor(v, offset);
                      setFrameKey((k) => k + 1);
                    }}
                  >
                    <SelectTrigger size="sm" className="w-auto text-xs">
                      <SelectValue placeholder="Frames..." />
                    </SelectTrigger>
                    <SelectContent>
                      {FRAME_OPTIONS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <FormControl>
                {showPreview ? (
                  <div className="prose prose-invert border-border bg-muted text-foreground min-h-[200px] max-w-none rounded-md border p-3 text-sm">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={frameDataComponents}
                    >
                      {field.value || "*Aucun contenu*"}
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
                    placeholder="Ex: Sur DI bloqué → cr.HP xx Super (+8)..."
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
            Annuler
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Enregistrement…"
              : props.mode === "edit"
                ? "Mettre à jour"
                : "Créer le mémo"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
