"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSearchDialogStore } from "@/stores/search-dialog";
import { SemanticSearchBar } from "./semantic-search-bar";

export function SearchCommandDialog() {
  const open = useSearchDialogStore((state) => state.open);
  const setOpen = useSearchDialogStore((state) => state.setOpen);
  const toggle = useSearchDialogStore((state) => state.toggle);
  const pathname = usePathname();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        toggle();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Recherche sémantique</DialogTitle>
          <DialogDescription>
            Cherche par sens dans tes notes, tes mémos et le glossaire.
          </DialogDescription>
        </DialogHeader>
        <SemanticSearchBar autoFocus onResultClick={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
