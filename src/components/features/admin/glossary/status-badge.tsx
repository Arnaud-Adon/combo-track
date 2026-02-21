import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  published: boolean;
}

export function StatusBadge({ published }: StatusBadgeProps) {
  return (
    <Badge
      variant={published ? "default" : "secondary"}
      className={published ? "bg-emerald-500" : ""}
    >
      {published ? "Publié" : "Brouillon"}
    </Badge>
  );
}
