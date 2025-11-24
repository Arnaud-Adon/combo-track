import { formatTime } from "@/utils";

type StatusBarProps = {
  currentTime: number;
  videoDuration: number;
};

export function StatusBar({ currentTime, videoDuration }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
      <div className="text-sm text-muted-foreground">
        Temps actuel:{" "}
        <span className="font-mono">{formatTime(currentTime)}</span> /{" "}
        <span className="font-mono">{formatTime(videoDuration)}</span>
      </div>
    </div>
  );
}
