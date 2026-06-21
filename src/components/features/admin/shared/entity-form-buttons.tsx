"use client";

import { Button } from "@/components/ui/button";

type EntityFormButtonsProps = {
  mode: "create" | "edit";
  isPending: boolean;
  onCancel: () => void;
  /** All labels already translated. */
  cancelLabel: string;
  createLabel: string;
  updateLabel: string;
  creatingLabel: string;
  updatingLabel: string;
};

/**
 * Cancel + submit footer shared by the admin entity forms. The submit label
 * resolves from `mode` and `isPending`; callers pass the translated strings.
 */
export function EntityFormButtons({
  mode,
  isPending,
  onCancel,
  cancelLabel,
  createLabel,
  updateLabel,
  creatingLabel,
  updatingLabel,
}: EntityFormButtonsProps) {
  const submitLabel = isPending
    ? mode === "create"
      ? creatingLabel
      : updatingLabel
    : mode === "create"
      ? createLabel
      : updateLabel;

  return (
    <div className="flex gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isPending}
      >
        {cancelLabel}
      </Button>
      <Button type="submit" disabled={isPending}>
        {submitLabel}
      </Button>
    </div>
  );
}
