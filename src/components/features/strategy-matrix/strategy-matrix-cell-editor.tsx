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
              Cellule de stratégie
            </div>
            <DialogTitle className="font-display flex items-center gap-2 uppercase">
              <span className="text-primary">{myLevelLabel}</span>
              <span className="text-muted-foreground">×</span>
              <span>{opponentLevelLabel}</span>
            </DialogTitle>
            <DialogDescription>
              Décris ta stratégie pour cette combinaison d&apos;états. Markdown
              supporté.
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
                  {content || "*Aucun contenu*"}
                </ReactMarkdown>
              </div>
            ) : (
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) =>
                  setContent(e.target.value.slice(0, MAX_CELL_LENGTH))
                }
                placeholder="Ex: Punish max → cr.HP xx Super..."
                className="min-h-[200px]"
              />
            )}

            <FrameLegend className="pt-1" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={requestClose}>
              Annuler
            </Button>
            <Button type="button" onClick={handleSave}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmCloseOpen} onOpenChange={setConfirmCloseOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Abandonner les modifications ?</AlertDialogTitle>
            <AlertDialogDescription>
              Les changements apportés à cette cellule ne sont pas enregistrés.
              Voulez-vous vraiment fermer l&apos;éditeur ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuer l&apos;édition</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDiscard}>
              Abandonner
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
