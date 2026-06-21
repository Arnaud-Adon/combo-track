"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Mic, MicOff } from "lucide-react";
import { useTranslations } from "next-intl";

type NoteVoiceRecorderProps = {
  isListening: boolean;
  onToggle: () => void;
};

export function NoteVoiceRecorder({
  isListening,
  onToggle,
}: NoteVoiceRecorderProps) {
  const t = useTranslations("video.voiceRecorder");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "h-8 w-8",
            isListening && "text-destructive animate-pulse",
          )}
          aria-label={isListening ? t("stop") : t("start")}
        >
          {isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isListening ? t("stop") : t("dictate")}
      </TooltipContent>
    </Tooltip>
  );
}
