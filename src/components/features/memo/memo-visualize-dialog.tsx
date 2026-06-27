"use client";

import { MarkdownPreview } from "@/components/features/notation/markdown-preview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";

type VisualizeMemo = {
  id: string;
  title: string;
  content: string;
};

type Props = {
  memos: VisualizeMemo[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
};

export function MemoVisualizeDialog({ memos, index, onIndexChange }: Props) {
  const t = useTranslations("memo");
  const memo = index != null ? memos[index] : null;
  const hasMultiple = memos.length > 1;

  const goPrev = useCallback(() => {
    onIndexChange(
      index == null ? null : (index - 1 + memos.length) % memos.length,
    );
  }, [index, memos.length, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange(index == null ? null : (index + 1) % memos.length);
  }, [index, memos.length, onIndexChange]);

  useEffect(() => {
    if (index == null || !hasMultiple) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, hasMultiple, goPrev, goNext]);

  return (
    <Dialog
      open={index != null}
      onOpenChange={(isOpen) => !isOpen && onIndexChange(null)}
    >
      <DialogContent className="max-h-[90vh] sm:max-w-[700px]">
        {memo && (
          <>
            <DialogHeader>
              <DialogTitle>{memo.title}</DialogTitle>
            </DialogHeader>
            <div className="max-h-[75vh] overflow-y-auto px-1">
              {memo.content ? (
                <MarkdownPreview className="space-y-4 leading-relaxed [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:leading-relaxed">
                  {memo.content}
                </MarkdownPreview>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {t("visualize.emptyContent")}
                </p>
              )}
            </div>
            {hasMultiple && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={t("visualize.previous")}
                  onClick={goPrev}
                  className="absolute top-1/2 -left-16 z-10 size-11 -translate-y-1/2 rounded-full shadow-md"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={t("visualize.next")}
                  onClick={goNext}
                  className="absolute top-1/2 -right-16 z-10 size-11 -translate-y-1/2 rounded-full shadow-md"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
