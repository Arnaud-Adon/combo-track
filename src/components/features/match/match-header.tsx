import { ArrowLeft, CalendarDays, Clock, StickyNote } from "lucide-react";
import Link from "next/link";

import type { Match } from "@/../generated/prisma";
import { DeleteMatchDialog } from "@/components/features/match/delete-match-dialog";
import {
  getMatchTypeLabel,
  MatchStatusBadge,
} from "@/components/features/match/match-labels";
import { MatchReportDialog } from "@/components/features/video/match-report-dialog";
import type { MatchReportData } from "@/components/features/video/match-report-schema";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/utils";

type MatchHeaderProps = {
  match: Match;
  noteCount: number;
  existingReport: MatchReportData | null;
};

export function MatchHeader(props: MatchHeaderProps) {
  const { match, noteCount, existingReport } = props;

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        <Link href="/videos" aria-label="Retour aux replays">
          <Button
            variant="outline"
            size="icon"
            className="mt-1 shrink-0 rounded-full"
          >
            <ArrowLeft className="size-4" />
          </Button>
        </Link>

        <div className="min-w-0 flex-1">
          <div className="text-muted-foreground mb-2 flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
            <span className="text-primary">Replay</span>
            <span className="bg-border size-1 rounded-full" />
            <span>{getMatchTypeLabel(match.matchType)}</span>
          </div>

          <h1 className="font-display text-2xl uppercase md:text-3xl">
            {match.title}
          </h1>

          <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs">
            <MatchStatusBadge status={match.status} />
            {match.duration != null && (
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {formatTime(match.duration)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <StickyNote className="size-3.5" />
              {noteCount} note{noteCount > 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              {formatDate(match.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <MatchReportDialog
            matchId={match.id}
            noteCount={noteCount}
            existingReport={existingReport}
          />
          <DeleteMatchDialog matchId={match.id} matchTitle={match.title} />
        </div>
      </div>

      <div
        aria-hidden
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--border) 0%, var(--border) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}
