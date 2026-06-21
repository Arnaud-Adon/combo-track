"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useSearchDialogStore } from "@/stores/search-dialog";

export function SearchTriggerButton() {
  const t = useTranslations("search");
  const setOpen = useSearchDialogStore((state) => state.setOpen);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => setOpen(true)}
      aria-label={t("trigger.ariaLabel")}
      className="text-muted-foreground gap-2"
    >
      <Search className="h-4 w-4" />
      <span className="hidden sm:inline">{t("trigger.label")}</span>
      <kbd className="bg-muted hidden rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold sm:inline">
        ⌘K
      </kbd>
    </Button>
  );
}
