export function extractYoutubeVideoId(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}
