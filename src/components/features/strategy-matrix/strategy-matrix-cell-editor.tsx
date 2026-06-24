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
import { RichMarkdownEditor } from "@/components/features/editor/rich-markdown-editor";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
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
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setContent(initialContent);
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
            <DialogDescription>{t("cellEditor.description")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <RichMarkdownEditor
              value={content}
              onChange={setContent}
              maxLength={MAX_CELL_LENGTH}
              placeholder={t("cellEditor.placeholder")}
              ariaLabel={t("cellEditor.eyebrow")}
              className="min-h-[200px]"
            />

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
