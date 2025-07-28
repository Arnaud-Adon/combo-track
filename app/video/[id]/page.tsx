import { prisma } from "@/lib/prisma";
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

  const videoId = extractYoutubeVideoId(match.videoUrl);

  return <div></div>;
}

function extractYoutubeVideoId(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}
