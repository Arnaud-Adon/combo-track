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

**ComboTrack** is a Next.js 15 SaaS application for fighting game players to take timestamped notes on YouTube videos. The app follows a modern full-stack architecture with server-side rendering and client-side<> interactivity.

## Technical Stack

- Zustand
- React query
- Better-auth
- Prisma ORM
- Tailwind CSS

### Core Domain Models

The application revolves around three main entities:

- **User**: Authenticated users with email/password via Better-Auth
- **Match**: Represents a YouTube video session with title and videoUrl
- **Note**: Timestamped annotations linked to specific moments in a match video

### Database & ORM

- **PostgreSQL** database hosted on Neon
- **Prisma ORM** with custom output directory: `../generated/prisma`
- All models use **ULID** as primary keys (`@default(ulid())`)
- Database includes Better-Auth tables for session management

### Authentication Architecture

- **Better-Auth** for authentication with Prisma adapter
- Email/password authentication with auto sign-in enabled
- Session management with IP address and user agent tracking
- Client auth configuration in `src/lib/auth-client.ts`

### Data Layer Patterns

- **next-safe-action** for type-safe server actions with Zod validation
- All server actions use `actionClient` from `src/lib/safe-action.ts`
- Zod schemas for form validation and API input validation
- Environment variables validated with `@t3-oss/env-core` in `src/lib/env.ts`

### Component Architecture

**Feature-Based Organization**: Components are organized by domain features under `src/components/features/`

- **video/**: Core video player functionality
  - `video-player.tsx`: YouTube embed integration
  - `note-form.tsx`: Timestamped note creation form
  - `note-list.tsx`: Display saved notes
  - `status-bar.tsx`: Video playback status
  - `note-schema.ts`: Zod validation schemas
  - `note-action.ts`: Server actions for note operations

**UI Components**: shadcn/ui components in `src/components/ui/`

**Layout System**: Reusable layout components in `src/components/layout/`

### Routing & Pages

- **App Router** (Next.js 15) with TypeScript
- Dynamic routes: `/videos/[id]` for individual video pages
- Server components for data fetching with Prisma
- YouTube video ID extraction utility for URL processing

### Key Technical Patterns

1. **Path Aliases**: `@/*` maps to `src/*` for clean imports
2. **Form Management**: React Hook Form with Zod resolvers for type-safe forms
3. **Server Actions**: Type-safe server mutations with next-safe-action
4. **YouTube Integration**: Custom video player with timestamp tracking
5. **Styling**: Tailwind CSS with CSS variables for theming

### Development Notes

- Prisma client generates to `../generated/prisma` directory
- All forms use react-hook-form with zodResolver for validation
- Video timestamps are stored as integers (seconds)
- The app uses YouTube's embed API for video playback control

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
