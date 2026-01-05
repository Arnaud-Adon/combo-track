import { describe, it, expect } from "vitest";
import { extractYoutubeVideoId, formatTime } from "./index";

describe("extractYoutubeVideoId", () => {
  it("should extract video ID from standard YouTube URL", () => {
    const result = extractYoutubeVideoId(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    );
    expect(result).toBe("dQw4w9WgXcQ");
  });

  it("should extract video ID from short YouTube URL", () => {
    const result = extractYoutubeVideoId("https://youtu.be/dQw4w9WgXcQ");
    expect(result).toBe("dQw4w9WgXcQ");
  });

  it("should return null for invalid URL", () => {
    const result = extractYoutubeVideoId("https://example.com");
    expect(result).toBeNull();
  });

  it("should return null for empty string", () => {
    const result = extractYoutubeVideoId("");
    expect(result).toBeNull();
  });
});

describe("formatTime", () => {
  it('should format 0 seconds as "0:00"', () => {
    expect(formatTime(0)).toBe("0:00");
  });

  it('should format 59 seconds as "0:59"', () => {
    expect(formatTime(59)).toBe("0:59");
  });

  it('should format 60 seconds as "1:00"', () => {
    expect(formatTime(60)).toBe("1:00");
  });

  it('should format 3599 seconds as "59:59"', () => {
    expect(formatTime(3599)).toBe("59:59");
  });

  it("should pad minutes and seconds with leading zeros", () => {
    expect(formatTime(65)).toBe("1:05");
  });
});
