import { getTranslations } from "next-intl/server";

import type { MatchStatus, MatchType } from "@/../generated/prisma";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Translator } from "@/types/translator";

export function getMatchTypeLabel(
  matchType: MatchType,
  t: Translator,
): string {
  switch (matchType) {
    case "RANKED":
    case "TOURNAMENT":
    case "TRAINING":
      return t(`type.${matchType}`);
    default:
      return matchType;
  }
}

export function getStatusLabel(
  status: MatchStatus,
  t: Translator,
): string {
  switch (status) {
    case "DRAFT":
    case "COMPLETED":
    case "ANALYZED":
    case "IN_PROGRESS":
      return t(`status.${status}`);
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

export async function MatchStatusBadge(props: MatchStatusBadgeProps) {
  const { status, className } = props;
  const t = await getTranslations("match");

  return (
    <Badge
      className={cn(
        "rounded-full border font-mono",
        STATUS_BADGE[status],
        className,
      )}
    >
      {getStatusLabel(status, t as unknown as Translator)}
    </Badge>
  );
}
