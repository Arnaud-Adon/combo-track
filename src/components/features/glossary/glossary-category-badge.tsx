import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

// FGC-aligned chart tokens (defined in globals.css) instead of raw Tailwind colors.
const CHART_VARS = [
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
] as const;

function categoryAccent(category: string): string {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `var(${CHART_VARS[Math.abs(hash) % CHART_VARS.length]})`;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const accent = categoryAccent(category);

  return (
    <span
      className={cn(
        "border-border/60 bg-background/70 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase backdrop-blur",
        className,
      )}
      style={{ color: accent }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: accent }}
      />
      {category}
    </span>
  );
}
