import type { MatchReport } from "../../../../generated/prisma";
import type { MatchReportData } from "@/lib/ai/groq";

export type { MatchReportData };

export function parseStoredReport(report: MatchReport): MatchReportData {
  return {
    summary: report.summary,
    strengths: JSON.parse(report.strengths) as string[],
    weakness: report.weakness,
    keyMoments: JSON.parse(report.keyMoments) as Array<{
      timestamp: number;
      description: string;
    }>,
    recommendations: JSON.parse(report.recommendations) as string[],
  };
}
