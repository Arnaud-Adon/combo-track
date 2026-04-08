import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSpeechRecognition } from "./use-speech-recognition";

const createMockRecognition = () => ({
  lang: "",
  continuous: false,
  interimResults: false,
  onresult: null as ((event: unknown) => void) | null,
  onerror: null as ((event: unknown) => void) | null,
  onend: null as (() => void) | null,
  start: vi.fn(),
  stop: vi.fn(),
  abort: vi.fn(),
});

type MockRecognition = ReturnType<typeof createMockRecognition>;

let mockInstance: MockRecognition;

describe("useSpeechRecognition", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockInstance = createMockRecognition();
    (window as unknown as Record<string, unknown>).SpeechRecognition =
      undefined;
    (window as unknown as Record<string, unknown>).webkitSpeechRecognition =
      undefined;
  });

  it("should return isSupported = false when API is unavailable", () => {
    const { result } = renderHook(() => useSpeechRecognition());

    expect(result.current.isSupported).toBe(false);
    expect(result.current.isListening).toBe(false);
    expect(result.current.transcript).toBe("");
    expect(result.current.interimTranscript).toBe("");
    expect(result.current.error).toBeNull();
  });

  it("should return isSupported = true when SpeechRecognition exists", () => {
    (window as unknown as Record<string, unknown>).SpeechRecognition = vi.fn(
      () => mockInstance,
    );

    const { result } = renderHook(() => useSpeechRecognition());

    expect(result.current.isSupported).toBe(true);
  });

  it("should return isSupported = true when webkitSpeechRecognition exists", () => {
    (window as unknown as Record<string, unknown>).webkitSpeechRecognition =
      vi.fn(() => mockInstance);

    const { result } = renderHook(() => useSpeechRecognition());

    expect(result.current.isSupported).toBe(true);
  });

  it("should start listening when start() is called", () => {
    (window as unknown as Record<string, unknown>).SpeechRecognition = vi.fn(
      () => mockInstance,
    );

    const { result } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.start();
    });

    expect(result.current.isListening).toBe(true);
    expect(mockInstance.start).toHaveBeenCalled();
    expect(mockInstance.lang).toBe("fr-FR");
    expect(mockInstance.continuous).toBe(true);
    expect(mockInstance.interimResults).toBe(true);
  });

  it("should stop listening when stop() is called", () => {
    (window as unknown as Record<string, unknown>).SpeechRecognition = vi.fn(
      () => mockInstance,
    );

    const { result } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.stop();
    });

    expect(result.current.isListening).toBe(false);
    expect(mockInstance.stop).toHaveBeenCalled();
  });

  it("should accumulate final transcript from results", () => {
    (window as unknown as Record<string, unknown>).SpeechRecognition = vi.fn(
      () => mockInstance,
    );

    const { result } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.start();
    });

    act(() => {
      mockInstance.onresult?.({
        resultIndex: 0,
        results: {
          length: 1,
          0: {
            isFinal: true,
            0: { transcript: "Bonjour" },
            length: 1,
          },
        },
      });
    });

    expect(result.current.transcript).toBe("Bonjour");
    expect(result.current.interimTranscript).toBe("");
  });

  it("should show interim transcript for non-final results", () => {
    (window as unknown as Record<string, unknown>).SpeechRecognition = vi.fn(
      () => mockInstance,
    );

    const { result } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.start();
    });

    act(() => {
      mockInstance.onresult?.({
        resultIndex: 0,
        results: {
          length: 1,
          0: {
            isFinal: false,
            0: { transcript: "en cours" },
            length: 1,
          },
        },
      });
    });

    expect(result.current.interimTranscript).toBe("en cours");
    expect(result.current.transcript).toBe("");
  });

  it("should reset transcript when resetTranscript() is called", () => {
    (window as unknown as Record<string, unknown>).SpeechRecognition = vi.fn(
      () => mockInstance,
    );

    const { result } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.start();
    });

    act(() => {
      mockInstance.onresult?.({
        resultIndex: 0,
        results: {
          length: 1,
          0: {
            isFinal: true,
            0: { transcript: "texte" },
            length: 1,
          },
        },
      });
    });

    expect(result.current.transcript).toBe("texte");

    act(() => {
      result.current.resetTranscript();
    });

    expect(result.current.transcript).toBe("");
    expect(result.current.interimTranscript).toBe("");
  });

  it("should set error on recognition error", () => {
    (window as unknown as Record<string, unknown>).SpeechRecognition = vi.fn(
      () => mockInstance,
    );

    const { result } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.start();
    });

    act(() => {
      mockInstance.onerror?.({ error: "not-allowed" });
    });

    expect(result.current.error).toBe("Microphone non autorisé");
    expect(result.current.isListening).toBe(false);
  });

  it("should abort recognition on unmount", () => {
    (window as unknown as Record<string, unknown>).SpeechRecognition = vi.fn(
      () => mockInstance,
    );

    const { result, unmount } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.start();
    });

    unmount();

    expect(mockInstance.abort).toHaveBeenCalled();
  });

  it("should auto-restart when onend fires while still listening", () => {
    const startFn = vi.fn();
    const instance = { ...createMockRecognition(), start: startFn };
    (window as unknown as Record<string, unknown>).SpeechRecognition = vi.fn(
      () => instance,
    );

    const { result } = renderHook(() => useSpeechRecognition());

    act(() => {
      result.current.start();
    });

    expect(startFn).toHaveBeenCalledTimes(1);

    act(() => {
      instance.onend?.();
    });

    expect(startFn).toHaveBeenCalledTimes(2);
    expect(result.current.isListening).toBe(true);
  });
});
