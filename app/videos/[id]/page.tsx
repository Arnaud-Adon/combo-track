import { MatchHeader } from "@/components/features/match/match-header";
import { parseStoredReport } from "@/components/features/video/match-report-schema";
import { NoteForm } from "@/components/features/video/note-form";
import { NoteList } from "@/components/features/video/note-list";
import { VideoPlayer } from "@/components/features/video/video-player";
import { VideoTimecodeBar } from "@/components/features/video/video-timecode-bar";
import { prisma } from "@/lib/prisma";
import { extractYoutubeVideoId } from "@/utils";
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
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[360px]"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 50% 0%, var(--fgc-accent-soft) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <MatchHeader
          match={match}
          noteCount={notes.length}
          existingReport={existingReport}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="border-border bg-card overflow-hidden rounded-xl border">
              <div className="bg-primary/60 h-0.5 w-full" />
              <VideoPlayer videoId={videoId} />
            </div>

            <VideoTimecodeBar />

            <div className="border-border bg-card rounded-xl border p-5">
              <div className="mb-4 flex items-baseline gap-3">
                <span className="text-primary font-mono text-xs">+</span>
                <h2 className="font-display text-lg uppercase">
                  Poser une note
                </h2>
              </div>
              <NoteForm matchId={match.id} availableTags={tags} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20">
              <div className="border-border bg-card flex max-h-[70vh] flex-col rounded-xl border lg:max-h-[calc(100vh-8rem)]">
                <div className="border-border flex items-center justify-between border-b px-5 py-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-primary font-mono text-xs">
                      {String(notes.length).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-lg uppercase">Notes</h2>
                  </div>
                </div>
                <div className="overflow-y-auto p-4">
                  <NoteList notes={notes} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
