---
paths:
  - "src/lib/auth*"
  - "src/app/**/auth/**"
  - "**/login/**"
  - "**/signup/**"
---

# Authentication Architecture

- **Better-Auth** for authentication with Prisma adapter
- Email/password authentication with auto sign-in enabled
- Session management with IP address and user agent tracking
- Client auth configuration in `src/lib/auth-client.ts`
