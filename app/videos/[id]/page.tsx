import { NoteForm } from "@/components/features/video/note-form";
import { NoteList } from "@/components/features/video/note-list";
import { VideoPlayer } from "@/components/features/video/video-player";
import { Layout, LayoutHeader } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { extractYoutubeVideoId } from "@/utils";
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

  const videoId = extractYoutubeVideoId(match.videoUrl);

  if (!videoId) {
    notFound();
  }

  return (
    <Layout className="max-w-7xl">
      <LayoutHeader>
        <div className="flex items-center gap-4 w-full">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{match.title}</h1>
        </div>
      </LayoutHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="md:col-span-2 space-y-6">
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
          <div className="md:sticky md:top-6 md:max-h-[calc(100vh-8rem)]">
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-[60vh] md:max-h-[calc(100vh-16rem)]">
                <NoteList notes={notes} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
