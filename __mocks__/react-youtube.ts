import { vi } from "vitest";
import React from "react";

const mockPlayer = {
  playVideo: vi.fn(),
  pauseVideo: vi.fn(),
  getCurrentTime: vi.fn(() => 0),
  getDuration: vi.fn(() => 100),
  seekTo: vi.fn(),
};

const YouTube = ({
  videoId,
  onReady,
}: {
  videoId?: string;
  onReady?: (event: { target: typeof mockPlayer }) => void;
  onStateChange?: (event: unknown) => void;
  opts?: unknown;
}) => {
  React.useEffect(() => {
    if (onReady) {
      onReady({ target: mockPlayer });
    }
  }, [onReady]);

  return React.createElement(
    "div",
    {
      "data-testid": "youtube-player",
    },
    videoId ?? "",
  );
};

export default YouTube;
