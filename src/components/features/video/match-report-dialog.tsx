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
  const seekToTimestamp = useVideoPlayerStore((state) => state.seekToTimestamp);
  const [report, setReport] = useState<MatchReportData | null>(existingReport);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { execute, isPending } = useAction(generateReportAction, {
    onSuccess: ({ data }) => {
      if (data) {
        setReport(data);
        toast.success("Rapport généré avec succès");
        router.refresh();
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Erreur lors de la génération");
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
              Rapport IA
              {report && (
                <span className="bg-primary size-2 rounded-full" />
              )}
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {report
            ? "Consulter ou regénérer le rapport d'analyse IA de ce match"
            : "Analyser vos notes avec l'IA pour obtenir un bilan structuré du match"}
        </TooltipContent>
      </Tooltip>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Rapport d&apos;analyse IA</DialogTitle>
          <DialogDescription>
            {report
              ? "Analyse générée à partir de vos notes de match"
              : "Générez un rapport d'analyse basé sur vos notes"}
          </DialogDescription>
        </DialogHeader>

        {isPending ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <Loader2 className="text-primary size-8 animate-spin" />
            <p className="text-muted-foreground text-sm">
              Analyse en cours...
            </p>
          </div>
        ) : report ? (
          <ReportContent report={report} onTimestampClick={seekToTimestamp} />
        ) : (
          <div className="text-muted-foreground py-8 text-center text-sm">
            {canGenerate
              ? "Cliquez sur le bouton ci-dessous pour générer un rapport d'analyse basé sur vos notes."
              : `Il faut au moins 3 notes pour générer un rapport (${noteCount} actuellement).`}
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
            {report ? "Regénérer" : "Générer le rapport"}
          </Button>
        </DialogFooter>
      </DialogContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {report ? "Regénérer le rapport ?" : "Générer le rapport ?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {report
                ? "Le rapport actuel sera remplacé par une nouvelle analyse. L'IA réexaminera l'ensemble de vos notes pour produire un nouveau bilan. Cette action est irréversible."
                : `L'IA va analyser vos ${noteCount} notes pour générer un bilan structuré : résumé du match, points forts, axe d'amélioration, moments clés et recommandations d'entraînement.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmGenerate}>
              {report ? "Regénérer" : "Générer"}
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
  return (
    <div className="space-y-5">
      <section>
        <h3 className="mb-2 text-sm font-semibold">Résumé</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {report.summary}
        </p>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold">Points forts</h3>
        <ul className="space-y-1.5">
          {report.strengths.map((strength, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle className="mt-0.5 size-4 shrink-0 text-green-500" />
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="border-l-4 border-orange-400 pl-4">
          <h3 className="mb-1 text-sm font-semibold">Point à améliorer</h3>
          <p className="text-muted-foreground text-sm">{report.weakness}</p>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold">Moments clés</h3>
        <ul className="space-y-1.5">
          {report.keyMoments.map((moment, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <button
                type="button"
                onClick={() => onTimestampClick(moment.timestamp)}
                className="bg-primary/10 text-primary mt-0.5 shrink-0 rounded-md px-2 py-0.5 font-mono text-xs font-bold hover:bg-primary/20"
              >
                {formatTime(moment.timestamp)}
              </button>
              <span>{moment.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold">Recommandations</h3>
        <ol className="list-inside list-decimal space-y-1.5">
          {report.recommendations.map((rec, i) => (
            <li key={i} className="text-sm">
              <Target className="mb-0.5 mr-1.5 inline size-3.5 text-blue-500" />
              {rec}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
