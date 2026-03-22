"use client";

import type { TwitchStream } from "@/lib/twitch";
import { Tv } from "lucide-react";
import { StreamCard } from "./stream-card";

type StreamListProps = {
  streams: TwitchStream[];
};

export function StreamList({ streams }: StreamListProps) {
  if (streams.length === 0) {
    return (
      <div className="text-muted-foreground py-16 text-center">
        <Tv className="mx-auto mb-4 h-12 w-12" />
        <p className="text-lg">Aucun stream Street Fighter 6 en direct.</p>
        <p className="mt-2 text-sm">
          Revenez plus tard pour regarder des streams en direct !
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {streams.map((stream) => (
        <StreamCard key={stream.id} stream={stream} />
      ))}
    </div>
  );
}
