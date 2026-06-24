import { FGC_MOTIONS } from "@/components/features/strategy-matrix/strategy-matrix-types";

export const NUMPAD_GLYPHS: Record<string, string> = {
  "1": "↙",
  "2": "↓",
  "3": "↘",
  "4": "←",
  "5": "‧",
  "6": "→",
  "7": "↖",
  "8": "↑",
  "9": "↗",
};

export function numpadToGlyphs(numpad: string): string | null {
  let glyphs = "";
  for (const char of numpad) {
    if (char === "[" || char === "]") {
      glyphs += char;
      continue;
    }
    const glyph = NUMPAD_GLYPHS[char];
    if (!glyph) return null;
    glyphs += glyph;
  }
  return glyphs;
}

export type ButtonIntensity = "light" | "medium" | "heavy" | "neutral";
export type FrameTone = "positive" | "negative" | "neutral";

export type NotationSegment =
  | { kind: "button"; raw: string; intensity: ButtonIntensity }
  | { kind: "motion"; raw: string; glyphs: string | null; label: string | null }
  | { kind: "frame"; raw: string; tone: FrameTone }
  | { kind: "text"; raw: string };

function escapeRegex(source: string): string {
  return source.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

const FRAME_SOURCE = String.raw`\([+-]\d{1,2}\)|\(0\)`;
const INTENSITY_BUTTON_SOURCE = `LP|MP|HP|LK|MK|HK`;
const GENERIC_BUTTON_SOURCE = String.raw`(?:PPP|KKK|PP|KK|P|K)(?![A-Za-z])`;
const KNOWN_MOTION_SOURCE = [...FGC_MOTIONS]
  .sort((a, b) => b.value.length - a.value.length)
  .map((motion) => escapeRegex(motion.value))
  .join("|");
const GENERIC_MOTION_SOURCE = String.raw`[1-9]{2,5}`;

const NOTATION_PATTERN = new RegExp(
  `(${FRAME_SOURCE})|(${INTENSITY_BUTTON_SOURCE})|(${GENERIC_BUTTON_SOURCE})|(${KNOWN_MOTION_SOURCE})|(${GENERIC_MOTION_SOURCE})`,
  "g",
);

function frameTone(raw: string): FrameTone {
  if (raw.includes("+")) return "positive";
  if (raw.includes("-")) return "negative";
  return "neutral";
}

function buttonIntensity(raw: string): ButtonIntensity {
  const first = raw[0];
  if (first === "L") return "light";
  if (first === "M") return "medium";
  if (first === "H") return "heavy";
  return "neutral";
}

function motionLabel(raw: string): string | null {
  return FGC_MOTIONS.find((motion) => motion.value === raw)?.label ?? null;
}

export function parseNotation(input: string): NotationSegment[] {
  const segments: NotationSegment[] = [];
  let lastIndex = 0;

  for (const match of input.matchAll(NOTATION_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ kind: "text", raw: input.slice(lastIndex, index) });
    }

    const [full, frame, intensity, generic, knownMotion, genericMotion] = match;

    if (frame) {
      segments.push({ kind: "frame", raw: frame, tone: frameTone(frame) });
    } else if (intensity) {
      segments.push({
        kind: "button",
        raw: intensity,
        intensity: buttonIntensity(intensity),
      });
    } else if (generic) {
      segments.push({ kind: "button", raw: generic, intensity: "neutral" });
    } else {
      const raw = knownMotion ?? genericMotion;
      segments.push({
        kind: "motion",
        raw,
        glyphs: numpadToGlyphs(raw),
        label: motionLabel(raw),
      });
    }

    lastIndex = index + full.length;
  }

  if (lastIndex < input.length) {
    segments.push({ kind: "text", raw: input.slice(lastIndex) });
  }

  return segments;
}
