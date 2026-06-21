"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("video.suggestTags");

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
            {isSuggesting ? t("suggesting") : t("suggest")}
          </Button>
        </span>
      </TooltipTrigger>
      {disabled && <TooltipContent>{t("minChars")}</TooltipContent>}
    </Tooltip>
  );
}
