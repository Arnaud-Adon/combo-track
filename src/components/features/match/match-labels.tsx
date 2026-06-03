import type { MatchStatus, MatchType } from "@/../generated/prisma";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function getMatchTypeLabel(matchType: MatchType): string {
  switch (matchType) {
    case "RANKED":
      return "Ranked";
    case "TOURNAMENT":
      return "Tournoi";
    case "TRAINING":
      return "Training";
    default:
      return matchType;
  }
}

export function getStatusLabel(status: MatchStatus): string {
  switch (status) {
    case "DRAFT":
      return "Brouillon";
    case "COMPLETED":
      return "Complété";
    case "ANALYZED":
      return "Analysé";
    case "IN_PROGRESS":
      return "En cours";
    default:
      return status;
  }
}

const STATUS_BADGE: Record<MatchStatus, string> = {
  COMPLETED:
    "border-status-completed/20 bg-status-completed/10 text-status-completed",
  ANALYZED:
    "border-status-analyzed/20 bg-status-analyzed/10 text-status-analyzed",
  IN_PROGRESS:
    "border-status-in-progress/20 bg-status-in-progress/10 text-status-in-progress",
  DRAFT: "border-status-draft/20 bg-status-draft/10 text-status-draft",
};

type MatchStatusBadgeProps = {
  status: MatchStatus;
  className?: string;
};

export function MatchStatusBadge(props: MatchStatusBadgeProps) {
  const { status, className } = props;

  return (
    <Badge
      className={cn(
        "rounded-full border font-mono",
        STATUS_BADGE[status],
        className,
      )}
    >
      {getStatusLabel(status)}
    </Badge>
  );
}
