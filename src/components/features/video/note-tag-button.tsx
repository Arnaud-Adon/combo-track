"use client";

import { Tag } from "@/../generated/prisma";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

type NoteTagButtonProps = {
  tag: Tag;
  isSelected: boolean;
  isSuggested: boolean;
  isDisabled: boolean;
  onClick: () => void;
};

export function NoteTagButton({
  tag,
  isSelected,
  isSuggested,
  isDisabled,
  onClick,
}: NoteTagButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        isSelected
          ? "bg-primary text-primary-foreground"
          : isSuggested
            ? "bg-secondary text-secondary-foreground ring-primary/50 ring-2"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        isDisabled && "cursor-not-allowed opacity-50",
      )}
    >
      {isSuggested && <Sparkles className="mr-1 inline h-3 w-3" />}
      {tag.name}
    </button>
  );
}
