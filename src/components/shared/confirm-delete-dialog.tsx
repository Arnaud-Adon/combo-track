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

type ConfirmDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Dialog heading (already translated). */
  title: string;
  /** Body copy below the optional item name (already translated). */
  description: string;
  /** Name/content of the item being deleted, shown above the description. */
  itemName?: string | null;
  isPending: boolean;
  onConfirm: () => void;
  confirmLabel: string;
  cancelLabel: string;
  /** Label shown on the confirm button while the deletion is running. */
  deletingLabel: string;
  /** Optional server error rendered under the footer. */
  serverError?: string | null;
};

/**
 * Controlled confirmation dialog for destructive deletions. Pass already
 * translated strings — it is i18n-namespace agnostic so any feature can reuse it.
 */
export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  itemName,
  isPending,
  onConfirm,
  confirmLabel,
  cancelLabel,
  deletingLabel,
  serverError,
}: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {itemName ? (
              <>
                {itemName}
                <br />
                <br />
              </>
            ) : null}
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? deletingLabel : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
        {serverError ? (
          <p className="text-destructive mt-2 text-sm">{serverError}</p>
        ) : null}
      </AlertDialogContent>
    </AlertDialog>
  );
}
