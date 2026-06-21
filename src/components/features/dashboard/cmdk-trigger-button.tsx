"use client";

import { Command } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { useSearchDialogStore } from "@/stores/search-dialog";

type CmdkTriggerButtonProps = {
  className?: string;
  label?: string;
};

export function CmdkTriggerButton(props: CmdkTriggerButtonProps) {
  const { className, label } = props;
  const t = useTranslations("dashboard");
  const setOpen = useSearchDialogStore((state) => state.setOpen);
  const resolvedLabel = label ?? t("cmdk.placeholder");

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={cn(
        "border-border bg-card text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 inline-flex h-12 items-center gap-2 rounded-md border px-4 text-sm transition-colors",
        className,
      )}
    >
      <Command className="size-3.5" />
      <span className="font-mono tracking-wider">⌘K</span>
      <span>{resolvedLabel}</span>
    </button>
  );
}
