"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Mic, MicOff } from "lucide-react";

type NoteVoiceRecorderProps = {
  isListening: boolean;
  onToggle: () => void;
};

export function NoteVoiceRecorder({
  isListening,
  onToggle,
}: NoteVoiceRecorderProps) {
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
          aria-label={
            isListening
              ? "Arrêter la dictée vocale"
              : "Démarrer la dictée vocale"
          }
        >
          {isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isListening ? "Arrêter la dictée vocale" : "Dicter une note"}
      </TooltipContent>
    </Tooltip>
  );
}
