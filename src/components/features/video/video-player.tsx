"use client";

import { useEffect } from "react";
import YouTube, { YouTubeProps } from "react-youtube";

import { useVideoPlayerStore } from "@/stores/video-player";

type VideoPlayerProps = {
  videoId: string;
  matchId: string;
};

export function VideoPlayer({ videoId }: VideoPlayerProps) {
  const { setPlayerRef, updateDuration, updateCurrentTime } =
    useVideoPlayerStore();

  const onReady: YouTubeProps["onReady"] = (event) => {
    const player = event.target;
    setPlayerRef(player);
    const duration = player.getDuration();
    updateDuration(duration);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const player = useVideoPlayerStore.getState().playerRef;
      if (player && typeof player.getCurrentTime === "function") {
        const time = player.getCurrentTime();
        updateCurrentTime(time);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      useVideoPlayerStore.getState().reset();
    };
  }, [updateCurrentTime]);

  return (
    <div className="aspect-video w-full">
      <YouTube
        videoId={videoId}
        className="w-full h-full"
        onReady={onReady}
        opts={{
          height: "100%",
          width: "100%",
          playerVars: {
            autoplay: 0,
          },
        }}
      />
    </div>
  );
}
