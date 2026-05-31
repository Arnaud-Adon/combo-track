"use client";

import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SemanticSearchBar } from "./semantic-search-bar";

export function SearchCommandDialog() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
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
    </>
  );
}
