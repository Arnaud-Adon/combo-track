---
paths:
  - "src/components/**/*"
  - "src/app/**/*.tsx"
---

# Component Architecture

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

## Routing & Pages

- **App Router** (Next.js 15) with TypeScript
- Dynamic routes: `/videos/[id]` for individual video pages
- Server components for data fetching with Prisma
- YouTube video ID extraction utility for URL processing

## Styling

- Tailwind CSS with CSS variables for theming
