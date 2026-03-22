import { env } from "@/lib/env";

export type TwitchStream = {
  id: string;
  user_name: string;
  user_login: string;
  title: string;
  viewer_count: number;
  thumbnail_url: string;
  started_at: string;
  language: string;
  game_name: string;
};

const SF6_GAME_ID = "55453844";

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getTwitchAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const response = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.TWITCH_CLIENT_ID,
      client_secret: env.TWITCH_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    throw new Error(`Twitch auth failed: ${response.status}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;

  return cachedToken!;
}

export async function getStreetFighter6Streams(
  limit = 20,
): Promise<TwitchStream[]> {
  try {
    const token = await getTwitchAccessToken();

    const response = await fetch(
      `https://api.twitch.tv/helix/streams?game_id=${SF6_GAME_ID}&first=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-Id": env.TWITCH_CLIENT_ID,
        },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) {
      console.error(`Twitch API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.data ?? [];
  } catch (error) {
    console.error("Failed to fetch Twitch streams:", error);
    return [];
  }
}
