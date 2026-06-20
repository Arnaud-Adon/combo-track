import { FGC_BUTTONS } from "@/components/features/strategy-matrix/strategy-matrix-types";
import { cn } from "@/lib/utils";
import type {
  ButtonIntensity,
  FrameTone,
  NotationSegment,
} from "./notation-parser";

const BUTTON_INTENSITY_CLASS: Record<ButtonIntensity, string> = {
  light: "text-notation-light bg-notation-light/15",
  medium: "text-notation-medium bg-notation-medium/15",
  heavy: "text-notation-heavy bg-notation-heavy/15",
  neutral: "text-foreground bg-muted",
};

const FRAME_TONE_CLASS: Record<FrameTone, string> = {
  positive: "text-frame-positive",
  negative: "text-frame-negative",
  neutral: "text-frame-neutral",
};

type Props = {
  segment: NotationSegment;
};

export function NotationChip({ segment }: Props) {
  if (segment.kind === "button") {
    const label =
      FGC_BUTTONS.find((button) => button.value === segment.raw)?.label ??
      segment.raw;

    return (
      <span
        title={label}
        className={cn(
          "inline-flex items-center rounded px-1 py-0.5 text-[0.85em] leading-none font-semibold",
          BUTTON_INTENSITY_CLASS[segment.intensity],
        )}
      >
        {segment.raw}
      </span>
    );
  }

  if (segment.kind === "motion") {
    return (
      <span title={segment.label ?? undefined} className="font-semibold">
        {segment.glyphs ?? segment.raw}
      </span>
    );
  }

  if (segment.kind === "frame") {
    return (
      <span className={cn("font-semibold", FRAME_TONE_CLASS[segment.tone])}>
        {segment.raw}
      </span>
    );
  }

  return <>{segment.raw}</>;
}
