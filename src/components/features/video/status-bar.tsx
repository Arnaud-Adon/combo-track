import { formatTime } from "@/utils";

type StatusBarProps = {
  currentTime: number;
  videoDuration: number;
};

export function StatusBar({ currentTime, videoDuration }: StatusBarProps) {
  return (
    <div className="bg-muted flex items-center justify-between rounded-lg p-4">
      <div className="text-muted-foreground text-sm">
        Temps actuel:{" "}
        <span className="font-mono">{formatTime(currentTime)}</span> /{" "}
        <span className="font-mono">{formatTime(videoDuration)}</span>
      </div>
    </div>
  );
}
