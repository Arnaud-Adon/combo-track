"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSearchDialogStore } from "@/stores/search-dialog";

export function SearchTriggerButton() {
  const setOpen = useSearchDialogStore((state) => state.setOpen);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => setOpen(true)}
      aria-label="Ouvrir la recherche"
      className="text-muted-foreground gap-2"
    >
      <Search className="h-4 w-4" />
      <span className="hidden sm:inline">Rechercher…</span>
      <kbd className="bg-muted hidden rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold sm:inline">
        ⌘K
      </kbd>
    </Button>
  );
}
