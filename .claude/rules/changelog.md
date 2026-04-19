# Changelog Maintenance

**CRITICAL**: ALWAYS update `CHANGELOG.md` at the project root after any code change or commit. This is non-negotiable.

## When to update

- After every commit made in the codebase
- After every code change, even minor ones (fix, refactor, docs, style, chore)
- Before ending any task that modified files

## Format

Entries are grouped by **date** (ISO format `YYYY-MM-DD`) using a `##` heading. All commits/changes made on the same day MUST be grouped under the same date heading.

Each individual change is written as its own `###` subsection, formatted as:

```
### <Type>: <Title>
```

Where:

- **`<Type>`** is one of: `Added`, `Changed`, `Fixed`, `Removed`, `Deprecated`, `Security`, `Refactor`, `Docs`, `Chore`
- **`<Title>`** is a concise, imperative description of the change (matching the commit subject when applicable)

### Structure

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## 2026-04-13

### Added: AI match report generation with Groq

### Added: Voice-to-note dictation

### Fixed: Note count display and sticky note list positioning

### Changed: Smart note templates behavior

## 2026-04-12

### Added: AI tag suggestions with Groq
```

Dates are ordered from **most recent to oldest** (newest date at the top).

## How to apply

1. If `CHANGELOG.md` does not exist at the project root, create it with the header above.
2. Determine today's date in `YYYY-MM-DD` format.
3. If a `## YYYY-MM-DD` section for today already exists, append the new `### Type: Title` subsection inside it.
4. If no section for today exists, create a new `## YYYY-MM-DD` section at the top (just below the intro) and add the subsection under it.
5. Never split same-day commits across multiple date sections — always regroup them under one date.
6. One change = one `###` subsection. Do not use bullet lists.
7. Keep titles short — the subsection heading is the entire entry. No paragraphs, no commit hashes, no author info, no body text.
8. If multiple changes happen in one task, add one `###` subsection per logical change.
9. NEVER skip the changelog update, even for tiny fixes or documentation tweaks.
