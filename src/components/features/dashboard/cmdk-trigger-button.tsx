"use client";

import { Command } from "lucide-react";

import { cn } from "@/lib/utils";

type CmdkTriggerButtonProps = {
  className?: string;
  label?: string;
};

function openSearch() {
  window.dispatchEvent(
    new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }),
  );
}

export function CmdkTriggerButton(props: CmdkTriggerButtonProps) {
  const { className, label = "Chercher dans ton labo" } = props;

  return (
    <button
      type="button"
      onClick={openSearch}
      className={cn(
        "border-border bg-card text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 inline-flex h-12 items-center gap-2 rounded-md border px-4 text-sm transition-colors",
        className,
      )}
    >
      <Command className="size-3.5" />
      <span className="font-mono tracking-wider">⌘K</span>
      <span>{label}</span>
    </button>
  );
}
