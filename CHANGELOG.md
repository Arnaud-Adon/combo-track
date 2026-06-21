# Changelog

All notable changes to this project will be documented in this file.

## 2026-06-21

### Added: Language filter on the streams page to filter live SF6 streams by language

### Added: Quick-access icon rail (Replays, Combos, Matrices, Mémos, Glossaire) as a right-edge overlay from the lg breakpoint, with accessible labels and tooltips

### Changed: Deduplicate authenticated navigation — top bar keeps Dashboard/Stream/Admin, the rail owns the labo modules, and the mobile menu becomes the complete grouped menu

### Docs: Add accessibility (a11y) rule for icon-only controls, focus, landmarks and target size

### Added: FGC notation toolbar in the glossary article editor, with colored rendering in the admin preview and the public article view

## 2026-06-20

### Added: Colored FGC button rendering (LP/MP/HP → blue/yellow/red) in inline-code notation across memo, strategy matrix cell editor and grid previews

### Added: Motion input rendering as directional arrow glyphs (236→↓↘→, 623, 214…) with hover labels in notation

### Added: Motion notation dropdown (236/623/214…) with arrow-glyph labels in memo and strategy matrix cell editors

### Changed: Notation/Motion/Frames dropdowns now auto-wrap inserted tokens into inline-code so notation renders colored without typing backticks

### Changed: Inserting a button from the notation dropdown closes the inline-code zone and adds a trailing space outside the backtick for readability

## 2026-06-12

### Added: Inline image upload in glossary article content — insert button injects markdown, images render in editor preview and consultation view

### Added: Glossary article cover image hero at top of consultation view when present

## 2026-06-11

### Fixed: Server Action body size limit set to 2mb — image uploads over the 1mb default no longer rejected

### Fixed: Mount Sonner Toaster in root layout — toasts now render app-wide

### Added: Client-side size/format validation on glossary image upload with error toast

### Added: Glossary article cover image upload (R2 storage) with edit-form field and card rendering

### Refactor: Redesign glossary listing with FGC design system — card grid, cover slot (image-ready), display/mono typography and chart-token category badges

## 2026-06-08

### Fixed: Glossary article view spacing — markdown renderer now spaces headings, paragraphs and lists

### Added: glossary-from-youtube skill — transcript a fighting-game tutorial into FGC-voiced glossary entries

### Added: `pnpm transcript` script — fetch YouTube transcripts with timestamps via yt-dlp

### Changed: `pnpm transcript` defaults to Chrome cookies (avoids YouTube HTTP 429), with `--cookies <browser>` / `--no-cookies` overrides

### Added: `pnpm glossary:import` script — import structured glossary entries with semantic dedup and RAG embedding

## 2026-06-04

### Fixed: Search command dialog opened twice (duplicate mounted instances) — single store-driven dialog with shared trigger buttons

### Changed: Show landing page anchor links in the header only on the landing page

### Changed: Render strategy matrix cells with the markdown preview (frame-data colors, formatting) instead of plain truncated text

### Refactor: Redesign strategy matrix create/edit pages into numbered FGC sections (Modèle, Identité, Matchup, Axes, Matrice) with eyebrow/display headings, page glow and sticky action bar

### Changed: Strategy matrix grid color-codes mine=accent columns / opponent=neutral rows with explicit orientation corner for readability

### Added: Frame-data legend (avantage/désavantage/neutre) on the matrix builder and cell editor

### Changed: Promote AI fill to an accent primary action and restyle templates, axis builders, matchup selector and cell editor to FGC tokens

### Refactor: Redesign /videos/[id] match view with FGC training-room layout (command-bar header, framed player with accent rail, polished note form and notes list)

### Added: Live video timecode HUD bar on the match page (replaces the unused StatusBar component)

### Added: Shared match labels module (FR status/type labels + token-based MatchStatusBadge)

### Fixed: Note content invisible in dark mode on the match page (hardcoded text-black → text-foreground)

### Refactor: Match report content uses status/primary tokens instead of raw green-500/orange-400/blue-500

### Added: Branded CT favicon (app/icon.svg + multi-size favicon.ico) matching the header logo badge

### Refactor: Rebuild footer to match header identity (CT logo badge, font-display title, fgc-\* palette, mono link columns, hairline accent)

### Added: Dashboard command-center hero with FGC training-room identity (eyebrow, font-display greeting, ⌘K trigger, resource panel)

### Added: Dashboard module launcher (Replays, Combos, Matrices, Mémos, Glossaire) to drive multi-module activation

### Refactor: Dashboard recompose with shared SectionHeader (mono index + display + hairline) and staggered fgc-rise reveals

### Refactor: Polish replay, strategy-matrix and combo cards (mono dates via formatDate, accent left-rail hover, drop raw violet-500 for tokens)

### Removed: Generic violet-gradient dashboard CTA section and oversized red hero carousel blob

### Refactor: Add font-display to dashboard and admin page titles for Frame-Perfect identity consistency

## 2026-06-03

### Added: Design tokens for frame advantage (--frame-positive/negative/neutral), match status (--status-draft/in-progress/completed/analyzed) and note template categories (--tag-offense/defense/neutral/mental/execution/okizeme)

### Refactor: Frame data renderer now uses --frame-\* tokens instead of hardcoded text-blue/red/yellow

### Refactor: Note template selector uses --tag-\* tokens with single-color semantic styling (drops dark: modifier on color)

### Refactor: Dashboard hero carousel gradient uses FGC accent palette instead of orange-red-pink

### Refactor: Replay card status and duration badges use --status-\* and --fgc-accent tokens

### Fixed: Glossary article detail footer border uses --border instead of hardcoded zinc-800

## 2026-06-01

### Changed: Remap shadcn dark-mode design tokens to FGC palette in globals.css so the entire app inherits the Frame-Perfect identity in dark mode

### Added: Design system Claude rule in .claude/rules/design-system.md scoped to app and components

### Changed: Rename landing utilities from `accent-fgc` to `fgc-accent` for native Tailwind theme alignment

### Removed: Ad-hoc `.text-accent-fgc` / `.bg-accent-fgc` utilities from globals.css now superseded by Tailwind-generated `fgc-accent` utilities

## 2026-05-31

### Changed: Landing page redesigned with Frame-Perfect FGC identity (Departure Mono display font, red punish accent, dark training-room aesthetic)

### Added: New landing sections — Problem, Solution, Benefits Bento, Product Walkthrough, ⌘K Showcase, Notion comparative, Testimonials, Pricing, FAQ

### Added: FgcTerm inline glossary tooltips and AnimatedComboNotation typing effect on the marketing surface

### Added: Mobile sticky CTA bar appearing after scroll on the landing page

### Added: Personal memo notes with notation and frame data selectors, accessible from dashboard CTA

### Added: Memos indexed and searchable via semantic search (RAG) alongside notes and glossary

### Fixed: Memo RAG columns missing in DB by splitting add_memo migration and adding add_memo_embedding

### Added: Eye icon on memo list to preview content in a dialog

### Docs: Update PRD, ARCHI, LANDING_PAGE, PRICING to cover memos + ⌘K semantic search

## 2026-05-30

### Added: Cmd+K spotlight dialog for semantic search from anywhere in the dashboard

### Fixed: Load .env in backfill:embeddings script so t3-env validation passes when run via tsx

## 2026-05-25

### Added: Semantic search infrastructure with pgvector and OpenAI embeddings

### Added: Semantic search page on /search for notes and glossary

### Added: Backfill script for existing notes and glossary embeddings

## 2026-05-24

### Changed: Replace strategy matrix card actions (Ouvrir, Visualiser, Supprimer) with icon buttons + tooltips

### Added: Visualize strategy matrix in a read-only modal from the matrix list

### Added: List all user replays on /videos page

## 2026-05-08

### Changed: Combo form — pick game first, then filter characters by selected game

### Added: Responsive burger menu in header below lg breakpoint (1024px)

### Changed: Group admin nav links (Glossaire, Jeux, Personnages) under an Admin dropdown

## 2026-05-03

### Added: Personal combo notebook (CRUD) scoped per user with character + tags + notation

### Added: Extract-to-combo button on video notes — prefills combo form from a note

### Added: Recent combos section on dashboard

### Added: User nav link to /combos

## 2026-05-02

### Added: Admin management for characters (CRUD)

### Refactor: Extract generateSlug util to src/lib/slug.ts

### Refactor: Migrate Character queries from strategy-matrix to dedicated character.query.ts

### Added: Cell editor quick insert — selects notation FGC et frame data avec rendu coloré dans le preview

### Added: Dashboard — liste des dernières matrices de stratégie de l'utilisateur sous forme de cards

### Changed: Dashboard — cards matrices alignées (min-height) avec compteur de cellules remplies et plus d'espacement

## 2026-04-27

### Added: Strategy Matrix V3 (lite) — IA pré-remplissage des cellules via Groq

## 2026-04-26

### Added: Strategy Matrix V1 (matrice État × Action standalone)

### Added: Strategy Matrix V2 — matchup context (jeu, mon perso, perso adverse) + filtres liste

### Changed: Dashboard CTA "Nouvelle note personnelle" redirige vers la création de matrice de stratégie

## 2026-04-20

### Added: Prisma models Game, Character, Combo (phase 1)

### Added: Admin management for games (CRUD)

### Added: Seed data for 4 games and 24 characters

## 2026-04-15

### Refactor: Externalize CLAUDE.md sections into .claude/rules/
