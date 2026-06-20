"use client";

import {
  FGC_ACTIONS,
  FGC_BUTTONS,
  FGC_MOTIONS,
  FGC_POSITIONS,
  FRAME_OPTIONS,
} from "@/components/features/strategy-matrix/strategy-matrix-types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { insertNotationToken } from "@/lib/insert-notation";
import { useState, type RefObject } from "react";
import { numpadToGlyphs } from "./notation-parser";

type Props = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onValueChange: (next: string) => void;
  maxLength: number;
};

export function NotationToolbar({
  textareaRef,
  value,
  onValueChange,
  maxLength,
}: Props) {
  const [notationKey, setNotationKey] = useState(0);
  const [motionKey, setMotionKey] = useState(0);
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

  return (
    <div className="flex items-center gap-2">
      <Select
        key={`notation-${notationKey}`}
        onValueChange={(v) => {
          handleInsert(v, {
            closeZone: FGC_BUTTONS.some((button) => button.value === v),
          });
          setNotationKey((k) => k + 1);
        }}
      >
        <SelectTrigger size="sm" className="w-auto text-xs">
          <SelectValue placeholder="Notation..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Positions</SelectLabel>
            {FGC_POSITIONS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Boutons</SelectLabel>
            {FGC_BUTTONS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Actions</SelectLabel>
            {FGC_ACTIONS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        key={`motion-${motionKey}`}
        onValueChange={(v) => {
          handleInsert(v);
          setMotionKey((k) => k + 1);
        }}
      >
        <SelectTrigger size="sm" className="w-auto text-xs">
          <SelectValue placeholder="Motion..." />
        </SelectTrigger>
        <SelectContent>
          {FGC_MOTIONS.map((item) => {
            const glyphs = numpadToGlyphs(item.value);
            return (
              <SelectItem key={item.value} value={item.value}>
                {glyphs ? `${glyphs}  ${item.label}` : item.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

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
