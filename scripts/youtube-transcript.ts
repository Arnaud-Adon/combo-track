/**
 * Fetch a YouTube transcript by URL or video id, with timestamps.
 *
 * Usage:
 *   pnpm transcript "<youtube-url-or-id>" [--lang en] [--out transcript.json]
 *                   [--cookies chrome | --no-cookies]
 *
 * Source: yt-dlp (the most durable method against YouTube changes). It grabs
 * manual subtitles first, then auto-generated ones, in json3 format.
 *
 * Cookies default to Chrome (YouTube 429s anonymous subtitle requests). Override
 * the browser with `--cookies safari`, or disable with `--no-cookies`.
 *
 * Prerequisite: `brew install yt-dlp`
 * Fallback (no captions at all): download audio with yt-dlp and transcribe
 * with Whisper — see steps/step-01-transcript.md.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

type Json3Event = {
  tStartMs?: number;
  segs?: Array<{ utf8?: string }>;
};

type TranscriptSegment = {
  offset: number;
  timestamp: string;
  text: string;
};

type TranscriptResult = {
  videoId: string;
  url: string;
  language: string;
  segments: TranscriptSegment[];
  fullText: string;
};

type Args = {
  input: string;
  lang: string;
  out: string | null;
  cookies: string | null;
};

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const input = argv.find((arg) => !arg.startsWith("--"));

  if (!input) {
    console.error(
      'Usage: pnpm transcript "<youtube-url-or-id>" [--lang en] [--out file.json] [--cookies chrome | --no-cookies]',
    );
    process.exit(1);
  }

  const langIndex = argv.indexOf("--lang");
  const outIndex = argv.indexOf("--out");

  return {
    input,
    lang: langIndex !== -1 ? (argv[langIndex + 1] ?? "en") : "en",
    out: outIndex !== -1 ? (argv[outIndex + 1] ?? null) : null,
    cookies: resolveCookies(argv),
  };
}

// Default to Chrome cookies — YouTube 429s anonymous subtitle requests.
// Override with `--cookies <browser>`, disable with `--no-cookies`.
function resolveCookies(argv: string[]): string | null {
  if (argv.includes("--no-cookies")) {
    return null;
  }
  const cookiesIndex = argv.indexOf("--cookies");
  if (cookiesIndex !== -1) {
    return argv[cookiesIndex + 1] ?? "chrome";
  }
  return "chrome";
}

const VIDEO_ID = /^[a-zA-Z0-9_-]{11}$/;

function extractVideoId(input: string): string {
  if (VIDEO_ID.test(input)) {
    return input;
  }

  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new Error(
      `URL invalide : "${input}". Mets l'URL entre guillemets : ` +
        'pnpm transcript "https://www.youtube.com/watch?v=…"',
    );
  }

  // youtube.com/watch?v=ID
  const fromQuery = url.searchParams.get("v");
  if (fromQuery && VIDEO_ID.test(fromQuery)) {
    return fromQuery;
  }

  // youtu.be/ID, /shorts/ID, /embed/ID, /live/ID
  const last = url.pathname.split("/").filter(Boolean).at(-1);
  if (last && VIDEO_ID.test(last)) {
    return last;
  }

  throw new Error(
    `Impossible d'extraire le videoId de "${input}" — URL probablement tronquée. ` +
      "Mets-la entre guillemets : " +
      'pnpm transcript "https://www.youtube.com/watch?v=…"',
  );
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function downloadSubtitles(
  videoId: string,
  lang: string,
  cookies: string | null,
): string {
  const dir = mkdtempSync(join(tmpdir(), "yt-transcript-"));

  const args = [
    "--skip-download",
    "--write-subs",
    "--write-auto-subs",
    "--sub-langs",
    `${lang}.*,${lang}`,
    "--sub-format",
    "json3",
    "-P",
    dir,
    "-o",
    "%(id)s",
  ];

  // YouTube bot-check fix: borrow cookies from a signed-in browser.
  if (cookies) {
    args.push("--cookies-from-browser", cookies);
  }

  args.push(`https://www.youtube.com/watch?v=${videoId}`);

  try {
    execFileSync("yt-dlp", args, { stdio: ["ignore", "ignore", "inherit"] });
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      throw new Error("yt-dlp introuvable. Installe-le : brew install yt-dlp");
    }
    throw new Error(
      "yt-dlp a échoué. Causes fréquentes :\n" +
        "  1. yt-dlp obsolète → brew upgrade yt-dlp (ou pip install -U yt-dlp)\n" +
        "  2. « Sign in to confirm you're not a bot » → ajoute --cookies chrome " +
        "(ou safari/brave/firefox)",
    );
  }

  const files = readdirSync(dir).filter((f) => f.endsWith(".json3"));
  if (files.length === 0) {
    throw new Error(
      `Aucun sous-titre trouvé pour ${videoId} (langue ${lang}). ` +
        "Essaie une autre --lang, ou utilise le fallback Whisper (voir step-01).",
    );
  }

  const preferred = files.find((f) => f.includes(`.${lang}.`)) ?? files[0];
  return readFileSync(join(dir, preferred), "utf8");
}

function parseJson3(raw: string): TranscriptSegment[] {
  const data = JSON.parse(raw) as { events?: Json3Event[] };
  const segments: TranscriptSegment[] = [];

  for (const event of data.events ?? []) {
    if (!event.segs) {
      continue;
    }
    const text = event.segs
      .map((seg) => seg.utf8 ?? "")
      .join("")
      .replace(/\s+/g, " ")
      .trim();

    if (!text) {
      continue;
    }

    const offset = Math.floor((event.tStartMs ?? 0) / 1000);
    segments.push({ offset, timestamp: formatTimestamp(offset), text });
  }

  return segments;
}

function main(): void {
  const { input, lang, out, cookies } = parseArgs();
  const videoId = extractVideoId(input);

  console.error(`[transcript] fetching ${videoId} (lang ${lang})…`);

  const raw = downloadSubtitles(videoId, lang, cookies);
  const segments = parseJson3(raw);
  const fullText = segments.map((s) => `[${s.timestamp}] ${s.text}`).join("\n");

  const result: TranscriptResult = {
    videoId,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    language: lang,
    segments,
    fullText,
  };

  const payload = JSON.stringify(result, null, 2);

  if (out) {
    writeFileSync(out, payload, "utf8");
    console.error(`[transcript] ${segments.length} segments written to ${out}`);
  } else {
    process.stdout.write(payload);
  }
}

main();
