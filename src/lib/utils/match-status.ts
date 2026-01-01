import type { MatchStatus } from "../../../generated/prisma";

export function getStatusBadgeVariant(
  status: MatchStatus,
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "DRAFT":
      return "secondary";
    case "COMPLETED":
      return "default";
    case "ANALYZED":
      return "outline";
    case "IN_PROGRESS":
      return "destructive";
    default:
      return "default";
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
