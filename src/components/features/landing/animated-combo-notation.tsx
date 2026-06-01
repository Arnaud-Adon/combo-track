"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type AnimatedComboNotationProps = {
  combos: string[];
  className?: string;
  loop?: boolean;
  typingSpeedMs?: number;
  holdMs?: number;
};

export function AnimatedComboNotation(props: AnimatedComboNotationProps) {
  const {
    combos,
    className,
    loop = true,
    typingSpeedMs = 55,
    holdMs = 1800,
  } = props;

  const [comboIndex, setComboIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<"typing" | "holding" | "erasing">("typing");

  const currentCombo = combos[comboIndex] ?? "";

  useEffect(() => {
    if (combos.length === 0) return;

    if (phase === "typing") {
      if (charCount < currentCombo.length) {
        const id = setTimeout(() => setCharCount((c) => c + 1), typingSpeedMs);
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => setPhase("holding"), 0);
      return () => clearTimeout(id);
    }

    if (phase === "holding") {
      const id = setTimeout(
        () => setPhase(loop || comboIndex < combos.length - 1 ? "erasing" : "holding"),
        holdMs,
      );
      return () => clearTimeout(id);
    }

    if (phase === "erasing") {
      if (charCount > 0) {
        const id = setTimeout(() => setCharCount((c) => c - 1), typingSpeedMs / 2);
        return () => clearTimeout(id);
      }
      const next = (comboIndex + 1) % combos.length;
      setComboIndex(next);
      setPhase("typing");
    }
  }, [
    phase,
    charCount,
    comboIndex,
    combos.length,
    currentCombo.length,
    typingSpeedMs,
    holdMs,
    loop,
  ]);

  return (
    <span
      className={cn(
        "font-mono-fgc text-fgc-text fgc-cursor inline-block",
        className,
      )}
      aria-live="polite"
    >
      {currentCombo.slice(0, charCount)}
    </span>
  );
}
