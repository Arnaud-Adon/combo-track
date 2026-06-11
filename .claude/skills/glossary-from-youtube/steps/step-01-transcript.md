# Step 1 — Transcript

Goal: get the full transcript of the video with timestamps.

## Action

Run the transcript script (writes JSON to `.claude/output/glossary/`):

```bash
mkdir -p .claude/output/glossary
pnpm transcript "<youtube-url>" --lang en --out .claude/output/glossary/transcript.json
```

> **Quote the URL** (zsh treats `?` and `&` as globs). Cookies default to
> **Chrome** — YouTube blocks anonymous subtitle requests with "Sign in to
> confirm you're not a bot" / HTTP 429. Override the browser with
> `--cookies safari` (or `brave`/`firefox`), or disable with `--no-cookies`.

The script (`scripts/youtube-transcript.ts`) shells out to `yt-dlp`, grabs
manual subtitles first then auto-generated ones in json3, and produces:

```json
{
  "videoId": "…",
  "url": "https://www.youtube.com/watch?v=…",
  "language": "en",
  "segments": [{ "offset": 12, "timestamp": "0:12", "text": "…" }],
  "fullText": "[0:12] …\n[0:15] …"
}
```

## Fallbacks

1. **Bot-check / HTTP 429** — add `--cookies <browser>` (see note above). If it
   persists, the local `yt-dlp` is stale → `brew upgrade yt-dlp`.
2. **Wrong / missing language** — retry with another `--lang` (e.g. `--lang ja`,
   `--lang fr`). Auto-subs usually live under the spoken language code.
3. **`yt-dlp` not found** — `brew install yt-dlp`.
4. **No captions at all** — download audio and transcribe with Whisper:
   ```bash
   yt-dlp -x --audio-format mp3 -o audio.mp3 "<youtube-url>"
   ```
   then transcribe `audio.mp3` (OpenAI Whisper / `whisper.cpp`) and hand the
   text to step 2 in the same `fullText` shape.

## Also fetch metadata (optional)

`src/lib/youtube.ts` → `getVideoDetails(videoId)` returns title/description/tags
(needs `YOUTUBE_API_KEY`). Useful to title entries and confirm the game.

## State to carry forward

- `transcript_path` = `.claude/output/glossary/transcript.json`
- `video_url`, `video_title`

## Next

Read the transcript, then load `steps/step-02-extract.md`.
