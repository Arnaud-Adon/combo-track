import { env } from "@/lib/env";

interface YouTubeSnippet {
  title: string;
  description: string;
  tags?: string[];
  categoryId: string;
}

interface YouTubeVideoDetails {
  title: string;
  description: string;
  tags: string[];
  categoryId: string;
}

export async function getVideoDetails(
  videoId: string,
): Promise<YouTubeVideoDetails> {
  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.append("id", videoId);
  url.searchParams.append("part", "snippet");
  url.searchParams.append("key", env.YOUTUBE_API_KEY);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Erreur lors de la communication avec YouTube");
  }

  const data = await response.json();
  const item = data.items?.[0];

  if (!item) {
    throw new Error("Vidéo introuvable sur YouTube");
  }

  const snippet: YouTubeSnippet = item.snippet;

  return {
    title: snippet.title,
    description: snippet.description,
    tags: snippet.tags ?? [],
    categoryId: snippet.categoryId,
  };
}

const SF6_KEYWORDS = [
  "street fighter 6",
  "street fighter vi",
  "sf6",
  "sf 6",
] as const;

export function isStreetFighter6(details: YouTubeVideoDetails): boolean {
  const tagsLower = details.tags.map((tag) => tag.toLowerCase());

  if (
    tagsLower.some(
      (tag) =>
        tag.includes("street fighter 6") ||
        tag.includes("sf6") ||
        tag === "street fighter",
    )
  ) {
    return true;
  }

  const text = `${details.title} ${details.description}`.toLowerCase();

  return SF6_KEYWORDS.some((keyword) => text.includes(keyword));
}
