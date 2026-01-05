import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useVideoPlayerStore } from "./video-player";

describe("video player store", () => {
  beforeEach(() => {
    const { result } = renderHook(() => useVideoPlayerStore());

    act(() => {
      result.current.reset();
    });
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useVideoPlayerStore());

    expect(result.current.currentTime).toBe(0);
    expect(result.current.duration).toBe(0);
    expect(result.current.isReady).toBe(false);
    expect(result.current.playerRef).toBeNull();
  });

  it("should update current time", () => {
    const { result } = renderHook(() => useVideoPlayerStore());

    act(() => {
      result.current.updateCurrentTime(45);
    });

    expect(result.current.currentTime).toBe(45);
  });

  it("should update duration", () => {
    const { result } = renderHook(() => useVideoPlayerStore());

    act(() => {
      result.current.updateDuration(300);
    });

    expect(result.current.duration).toBe(300);
  });

  it("seekToTimestamp should reject negative values", () => {
    const { result } = renderHook(() => useVideoPlayerStore());
    const mockPlayer = {
      seekTo: vi.fn(),
      getCurrentTime: vi.fn(),
      getDuration: vi.fn(),
    };

    act(() => {
      result.current.setPlayerRef(mockPlayer);
      result.current.updateDuration(100);
      result.current.seekToTimestamp(-5);
    });

    expect(mockPlayer.seekTo).not.toHaveBeenCalled();
  });

  it("seekToTimestamp should reject values greater than duration", () => {
    const { result } = renderHook(() => useVideoPlayerStore());
    const mockPlayer = {
      seekTo: vi.fn(),
      getCurrentTime: vi.fn(),
      getDuration: vi.fn(),
    };

    act(() => {
      result.current.setPlayerRef(mockPlayer);
      result.current.updateDuration(100);
      result.current.seekToTimestamp(150);
    });

    expect(mockPlayer.seekTo).not.toHaveBeenCalled();
  });

  it("seekToTimestamp should accept valid timestamp", () => {
    const { result } = renderHook(() => useVideoPlayerStore());
    const mockPlayer = {
      seekTo: vi.fn(),
      getCurrentTime: vi.fn(),
      getDuration: vi.fn(),
    };

    act(() => {
      result.current.setPlayerRef(mockPlayer);
      result.current.updateDuration(100);
      result.current.seekToTimestamp(50);
    });

    expect(mockPlayer.seekTo).toHaveBeenCalledWith(50, true);
  });

  it("reset should restore initial state", () => {
    const { result } = renderHook(() => useVideoPlayerStore());

    act(() => {
      result.current.updateCurrentTime(50);
      result.current.updateDuration(200);
      result.current.reset();
    });

    expect(result.current.currentTime).toBe(0);
    expect(result.current.duration).toBe(0);
    expect(result.current.isReady).toBe(false);
  });
});
