import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDate, formatTime } from "@/utils";
import Link from "next/link";
import type { MatchStatus, MatchType } from "../../../../generated/prisma";
import { RecentMatches } from "../../../../prisma/query/match.query";

interface ReplayCardProps {
  match: RecentMatches[number];
}

function getMatchTypeLabel(matchType: MatchType): string {
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

function getStatusLabel(status: MatchStatus): string {
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

export function ReplayCard({ match }: ReplayCardProps) {
  return (
    <Link href={`/videos/${match.id}`}>
      <Card className="text-muted-foreground border-border bg-card/50 hover:border-primary/40 hover:bg-card cursor-pointer rounded-xl border border-l-2 border-l-transparent px-1 py-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-l-primary hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex w-full items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              {match.duration && (
                <Badge
                  className="border-primary/20 bg-accent text-primary border font-mono"
                  variant="outline"
                >
                  {formatTime(match.duration)}
                </Badge>
              )}
              <span className="text-foreground truncate text-lg">
                {match.title}
              </span>
            </div>
            <div className="text-muted-foreground shrink-0 font-mono text-xs">
              {formatDate(match.createdAt)}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge
                className={cn("rounded-full border", {
                  "border-status-completed/20 bg-status-completed/10 text-status-completed":
                    match.status === "COMPLETED",
                  "border-status-analyzed/20 bg-status-analyzed/10 text-status-analyzed":
                    match.status === "ANALYZED",
                  "border-status-in-progress/20 bg-status-in-progress/10 text-status-in-progress":
                    match.status === "IN_PROGRESS",
                  "border-status-draft/20 bg-status-draft/10 text-status-draft":
                    match.status === "DRAFT",
                })}
              >
                {getStatusLabel(match.status)}
              </Badge>
              <span className="font-mono text-[11px] tracking-wider uppercase">
                {getMatchTypeLabel(match.matchType)}
              </span>
            </div>

            <p className="font-mono text-xs">
              {match._count.notes} note{match._count.notes > 1 ? "s" : ""}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
