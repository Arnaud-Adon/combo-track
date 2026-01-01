import type { MatchType } from "../../../generated/prisma";

export function getMatchTypeLabel(matchType: MatchType): string {
  switch (matchType) {
    case "RANKED":
      return "Ranked Match";
    case "TOURNAMENT":
      return "Tournament";
    case "TRAINING":
      return "Training";
    default:
      return matchType;
  }
}
