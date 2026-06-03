import { cn } from "@/lib/utils";

const ITEMS = [
  { sample: "(+N)", label: "Avantage", cls: "text-frame-positive" },
  { sample: "(-N)", label: "Désavantage", cls: "text-frame-negative" },
  { sample: "(0)", label: "Neutre", cls: "text-frame-neutral" },
] as const;

type FrameLegendProps = {
  className?: string;
};

export function FrameLegend(props: FrameLegendProps) {
  const { className } = props;

  return (
    <div
      className={cn("flex flex-wrap items-center gap-x-4 gap-y-1", className)}
    >
      <span className="text-muted-foreground font-mono text-[10px] tracking-[0.2em] uppercase">
        Frame data
      </span>
      {ITEMS.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5 text-xs">
          <code className={cn("font-mono font-semibold", item.cls)}>
            {item.sample}
          </code>
          <span className="text-muted-foreground">{item.label}</span>
        </span>
      ))}
    </div>
  );
}
