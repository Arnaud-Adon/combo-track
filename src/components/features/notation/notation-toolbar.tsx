"use client";

import {
  FGC_ACTIONS,
  FGC_BUTTONS,
  FGC_MOTIONS,
  FGC_POSITIONS,
  FRAME_OPTIONS,
} from "@/components/features/strategy-matrix/strategy-matrix-types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { insertNotationToken } from "@/lib/insert-notation";
import { ChevronDown } from "lucide-react";
import { useState, type RefObject } from "react";
import { numpadToGlyphs } from "./notation-parser";

type Props = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onValueChange: (next: string) => void;
  maxLength?: number;
};

export function NotationToolbar({
  textareaRef,
  value,
  onValueChange,
  maxLength,
}: Props) {
  const [frameKey, setFrameKey] = useState(0);

  const handleInsert = (
    token: string,
    opts?: { cursorOffset?: number; closeZone?: boolean },
  ) => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? value.length;

    const result = insertNotationToken(value, start, end, token, {
      cursorOffset: opts?.cursorOffset,
      closeZone: opts?.closeZone,
      maxLength,
    });

    onValueChange(result.value);

    requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(result.cursor, result.cursor);
    });
  };

  const insertButton = (token: string) =>
    handleInsert(token, { closeZone: true });

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-auto gap-1.5 px-3 text-xs font-normal text-muted-foreground"
          >
            Notation...
            <ChevronDown aria-hidden className="size-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Positions</DropdownMenuLabel>
          {FGC_POSITIONS.map((position) => (
            <DropdownMenuSub key={position.value}>
              <DropdownMenuSubTrigger>{position.label}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onSelect={() => handleInsert(position.value)}
                  className="font-mono"
                >
                  {position.value}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {FGC_BUTTONS.map((button) => (
                  <DropdownMenuItem
                    key={button.value}
                    onSelect={() => insertButton(position.value + button.value)}
                    className="font-mono"
                  >
                    {position.value}
                    {button.value}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Boutons</DropdownMenuLabel>
          {FGC_BUTTONS.map((button) => (
            <DropdownMenuItem
              key={button.value}
              onSelect={() => insertButton(button.value)}
            >
              {button.label}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {FGC_ACTIONS.map((action) => (
            <DropdownMenuItem
              key={action.value}
              onSelect={() => handleInsert(action.value)}
            >
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-auto gap-1.5 px-3 text-xs font-normal text-muted-foreground"
          >
            Motion...
            <ChevronDown aria-hidden className="size-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {FGC_MOTIONS.map((motion) => {
            const glyphs = numpadToGlyphs(motion.value);
            return (
              <DropdownMenuSub key={motion.value}>
                <DropdownMenuSubTrigger>
                  {glyphs ? `${glyphs}  ${motion.label}` : motion.label}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onSelect={() => handleInsert(motion.value)}
                    className="font-mono"
                  >
                    {glyphs ? `${glyphs} ${motion.value}` : motion.value}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {FGC_BUTTONS.map((button) => (
                    <DropdownMenuItem
                      key={button.value}
                      onSelect={() => insertButton(motion.value + button.value)}
                      className="font-mono"
                    >
                      {motion.value}
                      {button.value}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Select
        key={`frame-${frameKey}`}
        onValueChange={(v) => {
          const option = FRAME_OPTIONS.find((o) => o.value === v);
          const offset =
            option && "cursorOffset" in option
              ? (option as { cursorOffset: number }).cursorOffset
              : undefined;
          handleInsert(v, { cursorOffset: offset });
          setFrameKey((k) => k + 1);
        }}
      >
        <SelectTrigger size="sm" className="w-auto text-xs">
          <SelectValue placeholder="Frames..." />
        </SelectTrigger>
        <SelectContent>
          {FRAME_OPTIONS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
