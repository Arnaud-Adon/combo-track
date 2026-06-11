# Step 4 — Import

Goal: write the entries to the database and embed them for RAG.

## Action

Default — import as **drafts** for review:

```bash
pnpm glossary:import .claude/output/glossary/entries.json
```

Update existing articles (merges decided in step 3):

```bash
pnpm glossary:import .claude/output/glossary/entries.json --update
```

Publish immediately (skip review — use only when confident):

```bash
pnpm glossary:import .claude/output/glossary/entries.json --publish
```

## What the script does

`scripts/glossary-import.ts` mirrors `createArticleAction`:

- picks the oldest `ADMIN` user as `createdBy`
- checks slug uniqueness (skips, or updates with `--update`)
- appends a `> Source : <url>` line to the content
- creates with `published: false` by default
- embeds the article inline (same vector pipeline as `backfill-embeddings.ts`),
  so it shows up in semantic search once published

## After import

- Drafts are **not** visible on `/glossary` and **not** returned by semantic
  search until published.
- Review and publish in **`/admin/glossary`**.

Report to the user: number created / updated / skipped, and the review link.
