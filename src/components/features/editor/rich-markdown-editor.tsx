"use client";

import {
  forwardRef,
  useRef,
  useState,
  type KeyboardEvent,
  type ComponentProps,
} from "react";
import { Eye, Pencil, Redo2, Undo2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { MarkdownPreview } from "@/components/features/notation/markdown-preview";
import { NotationToolbar } from "@/components/features/notation/notation-toolbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { wrapSelection } from "@/lib/wrap-selection";

import { FormatToolbar } from "./format-toolbar";
import { useEditorHistory } from "./use-editor-history";

type Props = Omit<ComponentProps<"textarea">, "onChange" | "value" | "ref"> & {
  value: string;
  onChange: (next: string) => void;
  maxLength?: number;
  ariaLabel?: string;
  formatToolbar?: boolean;
  notationToolbar?: boolean;
  preview?: boolean;
};

export const RichMarkdownEditor = forwardRef<HTMLTextAreaElement, Props>(
  function RichMarkdownEditor(
    {
      value,
      onChange,
      maxLength,
      ariaLabel,
      className,
      formatToolbar = true,
      notationToolbar = true,
      preview = true,
      ...rest
    },
    forwardedRef,
  ) {
    const t = useTranslations("common.editor");
    const [showPreview, setShowPreview] = useState(false);
    const innerRef = useRef<HTMLTextAreaElement>(null);

    const currentValue = value ?? "";
    const history = useEditorHistory(currentValue, onChange);

    const setRefs = (node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    const clamp = (next: string) =>
      maxLength != null ? next.slice(0, maxLength) : next;

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (!(event.metaKey || event.ctrlKey)) return;
      const key = event.key.toLowerCase();

      if (key === "z") {
        event.preventDefault();
        if (event.shiftKey) {
          history.redo();
        } else {
          history.undo();
        }
        return;
      }
      if (key === "y") {
        event.preventDefault();
        history.redo();
        return;
      }
      if (key !== "b" && key !== "i") return;
      event.preventDefault();

      const textarea = innerRef.current;
      const start = textarea?.selectionStart ?? currentValue.length;
      const end = textarea?.selectionEnd ?? currentValue.length;
      const marker = key === "b" ? "**" : "_";
      const result = wrapSelection(currentValue, start, end, marker, marker, {
        maxLength,
      });

      history.record(result.value);
      requestAnimationFrame(() => {
        textarea?.focus();
        textarea?.setSelectionRange(result.selectionStart, result.selectionEnd);
      });
    };

    return (
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {!showPreview && (
              <div className="flex items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label={t("undo")}
                  title={t("undo")}
                  disabled={!history.canUndo}
                  onClick={history.undo}
                >
                  <Undo2 aria-hidden />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label={t("redo")}
                  title={t("redo")}
                  disabled={!history.canRedo}
                  onClick={history.redo}
                >
                  <Redo2 aria-hidden />
                </Button>
                <Separator orientation="vertical" className="mx-1 h-5" />
              </div>
            )}
            {!showPreview && formatToolbar && (
              <FormatToolbar
                textareaRef={innerRef}
                value={currentValue}
                onValueChange={history.record}
                maxLength={maxLength}
              />
            )}
            {!showPreview && notationToolbar && (
              <NotationToolbar
                textareaRef={innerRef}
                value={currentValue}
                onValueChange={history.record}
                maxLength={maxLength}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            {maxLength != null && (
              <span className="text-muted-foreground text-xs tabular-nums">
                {currentValue.length} / {maxLength}
              </span>
            )}
            {preview && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview((v) => !v)}
                aria-label={showPreview ? t("edit") : t("preview")}
              >
                {showPreview ? (
                  <>
                    <Pencil className="mr-2 h-3 w-3" aria-hidden />
                    {t("edit")}
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-3 w-3" aria-hidden />
                    {t("preview")}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {showPreview ? (
          <MarkdownPreview
            emptyFallback={t("emptyPreview")}
            className="border-border bg-muted min-h-[120px] rounded-md border p-3"
          >
            {currentValue}
          </MarkdownPreview>
        ) : (
          <Textarea
            {...rest}
            ref={setRefs}
            value={currentValue}
            onChange={(e) => history.record(clamp(e.target.value))}
            onKeyDown={handleKeyDown}
            aria-label={ariaLabel}
            className={cn("min-h-[120px]", className)}
          />
        )}
      </div>
    );
  },
);
