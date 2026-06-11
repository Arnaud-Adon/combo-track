---
name: glossary-from-youtube
description: Turn a fighting-game matchup YouTube video into glossary entries — one per opposing character, containing only the advice against that character, in FGC language, imported into the ComboTrack glossary. Use when the user gives a YouTube URL and wants the matchup tips summarized and saved. Triggers on "glossary from youtube", "add this matchup to the glossary", "summarize this matchup video".
argument-hint: <youtube-url> [--lang en] [--cookies chrome] [--publish]
---

# Glossary from YouTube

Transform a fighting-game tutorial video into reviewed, FGC-native glossary
entries in the ComboTrack database.

## Pipeline

1. **Transcript** — fetch the video transcript with timestamps (`step-01-transcript.md`)
2. **Extract** — Claude keeps only the advice against the targeted character(s),
   one glossary entry per opposing character, in FGC language (`step-02-extract.md`)
3. **Dedup** — semantic check against the existing glossary, user validates
   (`step-03-dedup.md`)
4. **Import** — write entries as drafts, embed for RAG (`step-04-import.md`)

## Flags

- `--lang <code>` — transcript language (default `en`)
- `--cookies <browser>` — signed-in browser cookies for yt-dlp. **Defaults to
  `chrome`** (YouTube bot-check). Override (`safari`/`brave`/`firefox`) or
  disable with `--no-cookies`.
- `--publish` — import as published instead of draft (default: draft for review)

## Principles

- **Only matchup advice, one entry per opposing character.** Keep only the tips
  *against* the character(s) the video targets (punishes, how to beat their
  moves, oki to watch). Drop generic theory and intros. Generic tools (Perfect
  Parry, late DI…) are described inline within the matchup, never as their own
  entry.
- **FGC voice.** Use the vocabulary contract in `.claude/rules/design-system.md`
  (§ Tone): lab, oki, neutral, punish, BnB, matchup, frame trap, mixup, drive
  rush. Combo notations in mono (`2MK xx 236P`).
- **Human in the loop.** Default import is `published: false`. The user reviews
  in `/admin/glossary` before publishing.
- **Dedup before write.** Reuse the RAG glossary search so the same concept is
  not added twice.
- **Cite the source.** Every entry links back to the video URL.

## Quick start

Load `steps/step-01-transcript.md` and follow each step in order, passing state
(transcript path, entries JSON path) forward.

## Prerequisites

- Recent `yt-dlp` (`brew install yt-dlp` then keep it updated — stale versions
  fail with nsig/bot errors)
- A browser signed into YouTube for `--cookies`
- `.env` with `OPEN_AI_API_KEY` (embeddings) and `YOUTUBE_API_KEY` (metadata)
- At least one `ADMIN` user in the database (used as `createdBy`)
