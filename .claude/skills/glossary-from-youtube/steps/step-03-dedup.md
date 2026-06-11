# Step 3 — Dedup & validate

Goal: avoid adding a concept that already exists, and let the user confirm.

## Action — dry run

Run the import in dry-run mode. It reports, per entry, the semantically closest
existing glossary articles (cosine ≥ 85%) and the planned action — without
writing anything:

```bash
pnpm glossary:import .claude/output/glossary/entries.json --dry-run
```

Example output:

```
• Okizeme (oki) (okizeme)
  ~ proche de "Wakeup / réveil" (wakeup) — 88%
  → would CREATE
```

## Decide with the user

For each flagged near-duplicate, present the choice plainly:

- **Merge** → drop the new entry, or improve the existing one (re-run later with
  `--update` and the existing slug).
- **Keep both** → distinct enough; proceed.
- **Skip** → remove the entry from `entries.json`.

Edit `entries.json` to reflect the decisions before importing.

> Note: semantic dedup needs `OPEN_AI_API_KEY`. Without it, only exact-slug
> collisions are detected — fall back to comparing titles by hand.

## Next

Once `entries.json` is clean, load `steps/step-04-import.md`.
