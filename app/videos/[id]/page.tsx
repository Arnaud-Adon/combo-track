import { VideoPlayer } from "@/components/features/video/video-player";
import { NoteForm } from "@/components/features/video/note-form";
import { NoteList } from "@/components/features/video/note-list";
import { Layout, LayoutHeader } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { extractYoutubeVideoId } from "@/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
    include: {
      notes: {
        orderBy: {
          timestamp: "asc",
        },
      },
    },
  });

  if (!match) {
    notFound();
  }

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
              <VideoPlayer videoId={videoId} matchId={match.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ajouter une note</CardTitle>
            </CardHeader>
            <CardContent>
              <NoteForm matchId={match.id} />
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
                <NoteList notes={match.notes} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
