# Step 2 — Extract matchup advice

Goal: turn the transcript into structured glossary entries that contain **only
the advice against the character(s) the video targets** — one entry per opposing
character.

## Read first

- The transcript JSON from step 1 (`fullText` + `segments`).
- `.claude/rules/design-system.md` § Tone & vocabulary — the FGC vocabulary
  contract. Use it. No corporate wording.

## How to extract

1. **Identify the opposing character(s)** the video gives advice *against* (the
   "enumerated" characters — e.g. a "Matchup Express vs Jamie"). Also note the
   game (SF6, etc.) from the transcript or `getVideoDetails`.
2. **Keep only the concrete matchup advice** against each character:
   - punishes (what punishes which move, at what range, with what)
   - how to beat / contest specific moves (drive rush, fireball, dash-in…)
   - oki / wake-up and pressure to watch for, gaps to mash, what to bait
   - anti-airs, whiff punishes, frame situations
   - **Discard** everything else: intro, outro, "like & subscribe", generic
     theory not tied to the character, chit-chat.
3. **One entry per opposing character.** Do **not** create standalone entries for
   generic mechanics. If a tip uses a generic tool (Perfect Parry, late Drive
   Impact…), describe it **inline, applied to this matchup**.
4. Write each entry as a proper **article report** — see "Article style" below.

## Article style

The `content` must read like a well-written, well-spaced matchup article, not a
dump of fragments. Apply these rules:

- **Open with a framing paragraph** (1–3 sentences): who the character is, why the
  matchup is tricky, what the article covers.
- **Themed `###` sections** (e.g. "Punir les drinks", "Gérer le Drive Rush HP",
  "Oki & corner"). Under each, write **full-sentence prose paragraphs**, not
  telegraphic bullets.
- **Spacing:** one blank line between every paragraph and around every heading.
  Keep paragraphs short (2–4 sentences) so it breathes.
- **Weave timestamps into the sentence** rather than dropping them at the end:
  "Quand Jamie boit, tu le punis au `Level 1` (0:24)…".
- **Bullets only for a genuine short list** of discrete options (e.g. two tools
  to beat a move) — and each bullet is still a full sentence.
- **FGC voice:** `lab`, `neutral`, `punish`, `oki`, `frame trap`, `whiff punish`,
  `mixup`. Inputs / notations in mono: `` `2MK xx 236P` ``, `` `Drive Rush HP` ``.
- **Accurate:** uncertain frame data gets "≈", never invented. No filler, no
  corporate wording.

> Optional polish: after writing, you can run `/utils-fix-grammar` on the entry
> text to tighten spelling and grammar before import.

## Output shape

Write an array to `.claude/output/glossary/entries.json` — one object per
opposing character:

```json
[
  {
    "title": "Matchup : Jamie (SF6)",
    "slug": "matchup-jamie-sf6",
    "category": "Matchup",
    "excerpt": "Comment jouer le matchup contre Jamie : punir ses drinks, gérer son Drive Rush HP, lire son oki.",
    "content": "## Matchup : Jamie (SF6)\n\nJamie n'est pas le perso le plus fort, mais il vit sur ses pièges : si tu ne connais pas le matchup, tu te fais ouvrir vite.\n\n### Punir les drinks\n\nJamie boit très souvent pour monter son niveau. La plupart du temps, la `drink` est punissable : avec Ryu tu sors un `Level 1` ou un drive rush punish selon la distance (0:24).\n\n### Drive Rush HP\n\nSon `Drive Rush HP` est rapide, prioritaire et + au block (1:38). Tu le contestes au Perfect Parry en option select, ou en sortant ton Drive Impact le plus tard possible.",
    "sourceUrl": "https://www.youtube.com/watch?v=…"
  }
]
```

Field rules (match `src/components/features/admin/glossary/article-schema.ts`):

- `title` 3–200 chars · `slug` kebab `[a-z0-9-]` (optional — derived from title)
- `content` markdown, ≥10 chars · `excerpt` ≤500 chars · `category` required
- `sourceUrl` — the video URL (appended as a Source line on import)

## Category

Matchup entries use the `Matchup` category. Keep the title pattern
`Matchup : <Character> (<Game>)` so entries stay consistent and de-dup cleanly.

## Next

Load `steps/step-03-dedup.md`.
