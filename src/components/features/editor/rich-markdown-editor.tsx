"use client";

import {
  forwardRef,
  useRef,
  useState,
  type KeyboardEvent,
  type ComponentProps,
} from "react";
import { Eye, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

import { MarkdownPreview } from "@/components/features/notation/markdown-preview";
import { NotationToolbar } from "@/components/features/notation/notation-toolbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { wrapSelection } from "@/lib/wrap-selection";

import { FormatToolbar } from "./format-toolbar";

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
      if (key !== "b" && key !== "i") return;
      event.preventDefault();

      const textarea = innerRef.current;
      const start = textarea?.selectionStart ?? currentValue.length;
      const end = textarea?.selectionEnd ?? currentValue.length;
      const marker = key === "b" ? "**" : "_";
      const result = wrapSelection(currentValue, start, end, marker, marker, {
        maxLength,
      });

      onChange(result.value);
      requestAnimationFrame(() => {
        textarea?.focus();
        textarea?.setSelectionRange(result.selectionStart, result.selectionEnd);
      });
    };

    return (
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {!showPreview && formatToolbar && (
              <FormatToolbar
                textareaRef={innerRef}
                value={currentValue}
                onValueChange={onChange}
                maxLength={maxLength}
              />
            )}
            {!showPreview && notationToolbar && (
              <NotationToolbar
                textareaRef={innerRef}
                value={currentValue}
                onValueChange={onChange}
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
            onChange={(e) => onChange(clamp(e.target.value))}
            onKeyDown={handleKeyDown}
            aria-label={ariaLabel}
            className={cn("min-h-[120px]", className)}
          />
        )}
      </div>
    );
  },
);
