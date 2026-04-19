---
paths:
  - "**/*action*.ts"
  - "src/lib/safe-action.ts"
  - "src/lib/env.ts"
---

# Data Layer Patterns

- **next-safe-action** for type-safe server actions with Zod validation
- All server actions use `actionClient` from `src/lib/safe-action.ts`
- Zod schemas for form validation and API input validation
- Environment variables validated with `@t3-oss/env-core` in `src/lib/env.ts`
- Server Actions: type-safe server mutations with next-safe-action
