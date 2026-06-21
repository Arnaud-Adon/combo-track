"use client";

import { Radio } from "lucide-react";
import { useTranslations } from "next-intl";

import { useVideoPlayerStore } from "@/stores/video-player";
import { formatTime } from "@/utils";

export function VideoTimecodeBar() {
  const t = useTranslations("video.timecode");
  const currentTime = useVideoPlayerStore((state) => state.currentTime);
  const duration = useVideoPlayerStore((state) => state.duration);

  const progress =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="border-border bg-card flex items-center gap-4 rounded-xl border px-4 py-3">
      <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase">
        <Radio className="text-primary size-3.5" />
        {t("label")}
      </div>

      <div className="text-primary font-mono text-sm font-bold tabular-nums">
        {formatTime(currentTime)}
      </div>

      <div className="bg-secondary relative h-1 flex-1 overflow-hidden rounded-full">
        <div
          className="bg-primary absolute inset-y-0 left-0 rounded-full transition-[width] duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-muted-foreground font-mono text-sm tabular-nums">
        {formatTime(duration)}
      </div>
    </div>
  );
}
