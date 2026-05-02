# Changelog

All notable changes to this project will be documented in this file.

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
