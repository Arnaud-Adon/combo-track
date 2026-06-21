"use client";

import { useState } from "react";

type DeleteDialogState<T> = {
  open: boolean;
  item: T | null;
};

/**
 * State helper for a controlled delete confirmation dialog tied to a list item.
 * Replaces the repeated `useState<{ open; item }>` + open/close handlers.
 */
export function useDeleteDialog<T>() {
  const [state, setState] = useState<DeleteDialogState<T>>({
    open: false,
    item: null,
  });

  return {
    open: state.open,
    item: state.item,
    /** Open the dialog for the given item. */
    openWith: (item: T) => setState({ open: true, item }),
    /** Close and clear the selected item. */
    close: () => setState({ open: false, item: null }),
    /** `onOpenChange` handler for the dialog — clears the item on close. */
    onOpenChange: (open: boolean) => {
      if (!open) setState({ open: false, item: null });
    },
  };
}
