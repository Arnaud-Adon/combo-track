"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useVideoPlayerStore } from "@/stores/video-player";
import { formatTime } from "@/utils";
import { CheckCircle, FileText, Loader2, Target } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { generateReportAction } from "./match-report-action";
import type { MatchReportData } from "./match-report-schema";

type MatchReportDialogProps = {
  matchId: string;
  noteCount: number;
  existingReport: MatchReportData | null;
};

export function MatchReportDialog({
  matchId,
  noteCount,
  existingReport,
}: MatchReportDialogProps) {
  const router = useRouter();
  const t = useTranslations("video.report");
  const tCommon = useTranslations("common.buttons");
  const seekToTimestamp = useVideoPlayerStore((state) => state.seekToTimestamp);
  const [report, setReport] = useState<MatchReportData | null>(existingReport);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { execute, isPending } = useAction(generateReportAction, {
    onSuccess: ({ data }) => {
      if (data) {
        setReport(data);
        toast.success(t("generated"));
        router.refresh();
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? t("generationError"));
    },
  });

  const handleGenerateClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmGenerate = () => {
    setConfirmOpen(false);
    execute({ matchId });
  };

  const canGenerate = noteCount >= 3;

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant={report ? "outline" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <FileText className="size-4" />
              {t("trigger")}
              {report && (
                <span className="bg-primary size-2 rounded-full" />
              )}
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {report ? t("tooltipExisting") : t("tooltipNew")}
        </TooltipContent>
      </Tooltip>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("dialogTitle")}</DialogTitle>
          <DialogDescription>
            {report
              ? t("dialogDescriptionExisting")
              : t("dialogDescriptionNew")}
          </DialogDescription>
        </DialogHeader>

        {isPending ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <Loader2 className="text-primary size-8 animate-spin" />
            <p className="text-muted-foreground text-sm">{t("analyzing")}</p>
          </div>
        ) : report ? (
          <ReportContent report={report} onTimestampClick={seekToTimestamp} />
        ) : (
          <div className="text-muted-foreground py-8 text-center text-sm">
            {canGenerate
              ? t("ctaWithNotes")
              : t("notEnoughNotes", { count: noteCount })}
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={handleGenerateClick}
            disabled={!canGenerate || isPending}
            className="gap-2"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FileText className="size-4" />
            )}
            {report ? t("regenerate") : t("generate")}
          </Button>
        </DialogFooter>
      </DialogContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {report ? t("confirmTitleExisting") : t("confirmTitleNew")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {report
                ? t("confirmDescriptionExisting")
                : t("confirmDescriptionNew", { count: noteCount })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmGenerate}>
              {report ? t("regenerate") : t("confirmGenerate")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

function ReportContent({
  report,
  onTimestampClick,
}: {
  report: MatchReportData;
  onTimestampClick: (seconds: number) => void;
}) {
  const t = useTranslations("video.report");

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-muted-foreground mb-2 font-mono text-[10px] tracking-[0.2em] uppercase">
          {t("sectionSummary")}
        </h3>
        <p className="text-foreground text-sm leading-relaxed">
          {report.summary}
        </p>
      </section>

      <section>
        <h3 className="text-muted-foreground mb-2 font-mono text-[10px] tracking-[0.2em] uppercase">
          {t("sectionStrengths")}
        </h3>
        <ul className="space-y-1.5">
          {report.strengths.map((strength, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle className="text-status-completed mt-0.5 size-4 shrink-0" />
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-l-primary bg-accent rounded-r-md border-l-2 px-4 py-3">
        <h3 className="text-primary mb-1 font-mono text-[10px] tracking-[0.2em] uppercase">
          {t("sectionWeakness")}
        </h3>
        <p className="text-foreground text-sm">{report.weakness}</p>
      </section>

      <section>
        <h3 className="text-muted-foreground mb-2 font-mono text-[10px] tracking-[0.2em] uppercase">
          {t("sectionKeyMoments")}
        </h3>
        <ul className="space-y-1.5">
          {report.keyMoments.map((moment, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <button
                type="button"
                onClick={() => onTimestampClick(moment.timestamp)}
                className="bg-accent text-primary hover:bg-primary/20 mt-0.5 shrink-0 rounded-md px-2 py-0.5 font-mono text-xs font-bold tabular-nums transition-colors"
              >
                {formatTime(moment.timestamp)}
              </button>
              <span>{moment.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-muted-foreground mb-2 font-mono text-[10px] tracking-[0.2em] uppercase">
          {t("sectionRecommendations")}
        </h3>
        <ol className="list-inside list-decimal space-y-1.5">
          {report.recommendations.map((rec, i) => (
            <li key={i} className="text-sm">
              <Target className="text-primary mr-1.5 mb-0.5 inline size-3.5" />
              {rec}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
