"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notationComponents } from "@/components/features/notation/notation-renderer";
import { NotationToolbar } from "@/components/features/notation/notation-toolbar";
import { FrameLegend } from "./frame-legend";
import { MAX_CELL_LENGTH } from "./strategy-matrix-types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialContent: string;
  myLevelLabel: string;
  opponentLevelLabel: string;
  onSave: (content: string) => void;
};

export function StrategyMatrixCellEditor({
  open,
  onOpenChange,
  initialContent,
  myLevelLabel,
  opponentLevelLabel,
  onSave,
}: Props) {
  const t = useTranslations("strategyMatrix");
  const tc = useTranslations("common");
  const [content, setContent] = useState(initialContent);
  const [showPreview, setShowPreview] = useState(false);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setContent(initialContent);
      setShowPreview(false);
      setConfirmCloseOpen(false);
    }
  }, [open, initialContent]);

  const isDirty = content !== initialContent;

  const handleSave = () => {
    onSave(content);
    onOpenChange(false);
  };

  const requestClose = () => {
    if (isDirty) {
      setConfirmCloseOpen(true);
      return;
    }
    onOpenChange(false);
  };

  const handleDialogOpenChange = (next: boolean) => {
    if (!next) {
      requestClose();
      return;
    }
    onOpenChange(next);
  };

  const handleConfirmDiscard = () => {
    setConfirmCloseOpen(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent
          className="sm:max-w-2xl"
          showCloseButton={false}
          onEscapeKeyDown={(event) => {
            if (isDirty) {
              event.preventDefault();
              setConfirmCloseOpen(true);
            }
          }}
          onPointerDownOutside={(event) => {
            if (isDirty) {
              event.preventDefault();
              setConfirmCloseOpen(true);
            }
          }}
          onInteractOutside={(event) => {
            if (isDirty) {
              event.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <div className="text-muted-foreground font-mono text-[10px] tracking-[0.2em] uppercase">
              {t("cellEditor.eyebrow")}
            </div>
            <DialogTitle className="font-display flex items-center gap-2 uppercase">
              <span className="text-primary">{myLevelLabel}</span>
              <span className="text-muted-foreground">×</span>
              <span>{opponentLevelLabel}</span>
            </DialogTitle>
            <DialogDescription>
              {t("cellEditor.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-mono text-xs tabular-nums">
                {content.length} / {MAX_CELL_LENGTH}
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
                    {t("cellEditor.edit")}
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-3 w-3" />
                    {t("cellEditor.preview")}
                  </>
                )}
              </Button>
            </div>

            {!showPreview && (
              <NotationToolbar
                textareaRef={textareaRef}
                value={content}
                onValueChange={setContent}
                maxLength={MAX_CELL_LENGTH}
              />
            )}

            {showPreview ? (
              <div className="prose prose-invert border-border bg-muted text-foreground min-h-[200px] max-w-none rounded-md border p-3 text-sm">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={notationComponents}
                >
                  {content || t("cellEditor.emptyPreview")}
                </ReactMarkdown>
              </div>
            ) : (
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) =>
                  setContent(e.target.value.slice(0, MAX_CELL_LENGTH))
                }
                placeholder={t("cellEditor.placeholder")}
                className="min-h-[200px]"
              />
            )}

            <FrameLegend className="pt-1" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={requestClose}>
              {tc("buttons.cancel")}
            </Button>
            <Button type="button" onClick={handleSave}>
              {tc("buttons.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmCloseOpen} onOpenChange={setConfirmCloseOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("cellEditor.discardTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("cellEditor.discardDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cellEditor.keepEditing")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDiscard}>
              {t("cellEditor.discard")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
