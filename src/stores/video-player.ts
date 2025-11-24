import { create } from "zustand";

type YouTubePlayer = {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
};

interface VideoPlayerState {
  playerRef: YouTubePlayer | null;
  currentTime: number;
  duration: number;
  isReady: boolean;
  setPlayerRef: (ref: YouTubePlayer) => void;
  seekToTimestamp: (seconds: number) => void;
  updateCurrentTime: (time: number) => void;
  updateDuration: (duration: number) => void;
  reset: () => void;
}

export const useVideoPlayerStore = create<VideoPlayerState>((set, get) => ({
  playerRef: null,
  currentTime: 0,
  duration: 0,
  isReady: false,

  setPlayerRef: (ref) =>
    set({
      playerRef: ref,
      isReady: true,
    }),

  seekToTimestamp: (seconds) => {
    const state = get();

    if (!state.playerRef || !state.isReady) {
      console.warn("Video player not ready");
      return;
    }

    if (seconds < 0 || seconds > state.duration) {
      console.warn(
        `Invalid timestamp: ${seconds}. Duration: ${state.duration}`,
      );
      return;
    }

    state.playerRef.seekTo(seconds, true);
  },

  updateCurrentTime: (time) => set({ currentTime: time }),

  updateDuration: (duration) => set({ duration }),

  reset: () =>
    set({
      playerRef: null,
      currentTime: 0,
      duration: 0,
      isReady: false,
    }),
}));
