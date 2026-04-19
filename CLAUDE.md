# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:ci` - Run ESLint for CI
- `pnpm ts` - Run TypeScript compiler check

## Architecture Overview

**ComboTrack** is a Next.js 15 SaaS application for fighting game players to take timestamped notes on YouTube videos.

## Technical Stack

- Zustand
- React Query
- Better-auth
- Prisma ORM
- Tailwind CSS

## Typescript import path

- `@/*` is a link to `./src/*`

## Coding preferences

- use `??` instead `||`

## Workflow modifications

🚨 **CRITICAL RULES – ALWAYS FOLLOW THIS** 🚨

**BEFORE editing any files, you must read at least 3 files**

That will help you understand how to make coherence and consistency.

This is **non-negotiable**. Do not skip this step under any circumstances. Reading existing files and ensures :

- Code consistency with project patterns.
- Proper understanding of conventions
- Following established architecture.
- Avoiding breaking changes.

**Steps to follow**

1. Read at least three relevant existing files first.
2. Understand patterns and conventions.
3. Only then proceed with creating/editing files.
