"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, Sparkles } from "lucide-react";

type NoteSuggestTagsButtonProps = {
  onSuggest: () => void;
  isSuggesting: boolean;
  disabled: boolean;
};

export function NoteSuggestTagsButton({
  onSuggest,
  isSuggesting,
  disabled,
}: NoteSuggestTagsButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSuggest}
            disabled={isSuggesting || disabled}
          >
            {isSuggesting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isSuggesting ? "Suggestion en cours..." : "Suggérer des tags"}
          </Button>
        </span>
      </TooltipTrigger>
      {disabled && (
        <TooltipContent>
          La note doit contenir au moins 10 caractères
        </TooltipContent>
      )}
    </Tooltip>
  );
}
