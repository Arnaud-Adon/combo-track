import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

const getCategoryColor = (category: string) => {
  const colors = [
    "border-violet-500/20 bg-violet-500/10 text-violet-400",
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    "border-blue-500/20 bg-blue-500/10 text-blue-400",
    "border-amber-500/20 bg-amber-500/10 text-amber-400",
    "border-rose-500/20 bg-rose-500/10 text-rose-400",
    "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
  ];

  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const colorClass = getCategoryColor(category);

  return (
    <Badge
      variant="outline"
      className={cn("rounded-full", colorClass, className)}
    >
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </Badge>
  );
}
