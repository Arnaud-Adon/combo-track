import { NoteForm } from "@/components/features/video/note-form";
import { NoteList } from "@/components/features/video/note-list";
import { MatchReportDialog } from "@/components/features/video/match-report-dialog";
import { parseStoredReport } from "@/components/features/video/match-report-schema";
import { VideoPlayer } from "@/components/features/video/video-player";
import { Layout, LayoutHeader } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { extractYoutubeVideoId } from "@/utils";
import { DeleteMatchDialog } from "@/components/features/match/delete-match-dialog";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const match = await prisma.match.findUnique({
    where: {
      id,
    },
  });

  if (!match) {
    notFound();
  }

  const notes = await prisma.note.findMany({
    where: {
      matchId: match.id,
    },
    include: {
      tags: true,
    },
    orderBy: {
      timestamp: "asc",
    },
  });

  const tags = await prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const storedReport = await prisma.matchReport.findUnique({
    where: { matchId: match.id },
  });

  const existingReport = storedReport ? parseStoredReport(storedReport) : null;

  const videoId = extractYoutubeVideoId(match.videoUrl);

  if (!videoId) {
    notFound();
  }

  return (
    <Layout className="max-w-7xl pb-12">
      <LayoutHeader>
        <div className="flex w-full items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{match.title}</h1>
          <div className="ml-auto flex items-center gap-2">
            <MatchReportDialog
              matchId={match.id}
              noteCount={notes.length}
              existingReport={existingReport}
            />
            <DeleteMatchDialog matchId={match.id} matchTitle={match.title} />
          </div>
        </div>
      </LayoutHeader>

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardContent className="p-0">
              <VideoPlayer videoId={videoId} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ajouter une note</CardTitle>
            </CardHeader>
            <CardContent>
              <NoteForm matchId={match.id} availableTags={tags} />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <div className="md:sticky md:top-20 md:max-h-[calc(100vh-6rem)]">
            <Card>
              <CardHeader>
                <CardTitle>
                  Notes{" "}
                  <span className="text-muted-foreground font-normal">
                    ({notes.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[60vh] overflow-y-auto md:max-h-[calc(100vh-16rem)]">
                <NoteList notes={notes} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
