"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TwitchStream } from "@/lib/twitch";
import { Eye, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type StreamCardProps = {
  stream: TwitchStream;
};

function formatViewerCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

function formatStartedAt(startedAt: string): string {
  const start = new Date(startedAt);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) {
    return `${diffMins}min`;
  }

  const diffHours = Math.floor(diffMins / 60);
  const remainingMins = diffMins % 60;

  if (remainingMins === 0) {
    return `${diffHours}h`;
  }

  return `${diffHours}h${remainingMins}min`;
}

function getThumbnailUrl(templateUrl: string): string {
  return templateUrl
    .replace("{width}", "440")
    .replace("{height}", "248");
}

export function StreamCard({ stream }: StreamCardProps) {
  return (
    <Link href={`/stream?channel=${stream.user_login}`}>
      <Card className="cursor-pointer overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-0 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-lg">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={getThumbnailUrl(stream.thumbnail_url)}
            alt={stream.title}
            width={440}
            height={248}
            className="h-full w-full object-cover"
            unoptimized
          />
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
            <Badge className="border border-red-500/30 bg-red-600 text-white">
              LIVE
            </Badge>
            <Badge
              variant="outline"
              className="border border-zinc-700 bg-zinc-900/80 text-zinc-300"
            >
              <Eye className="h-3 w-3" />
              {formatViewerCount(stream.viewer_count)}
            </Badge>
          </div>
        </div>
        <CardHeader className="px-4 py-3">
          <CardTitle className="flex items-center justify-between">
            <span className="text-foreground text-sm font-semibold">
              {stream.user_name}
            </span>
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              {formatStartedAt(stream.started_at)}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {stream.title}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-violet-500/20 bg-violet-500/10 text-violet-400"
            >
              {stream.language.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
