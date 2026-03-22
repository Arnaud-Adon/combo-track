"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TwitchEmbed } from "react-twitch-embed";

type StreamPlayerProps = {
  channel: string;
};

export function StreamPlayer({ channel }: StreamPlayerProps) {
  return (
    <div className="space-y-4">
      <Link href="/stream">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour aux streams
        </Button>
      </Link>
      <div className="h-[calc(100vh-10rem)] overflow-hidden rounded-xl border border-zinc-800 [&>div]:h-full [&>div>iframe]:h-full">
        <TwitchEmbed
          channel={channel}
          id={`twitch-${channel}`}
          darkMode
          width="100%"
          height="100%"
          muted={false}
        />
      </div>
    </div>
  );
}
