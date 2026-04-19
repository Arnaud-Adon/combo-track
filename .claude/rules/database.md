---
paths:
  - "prisma/**/*"
  - "src/lib/db*"
  - "**/*action*.ts"
---

# Database & ORM

- **PostgreSQL** database hosted on Neon
- **Prisma ORM** with custom output directory: `../generated/prisma`
- All models use **ULID** as primary keys (`@default(ulid())`)
- Database includes Better-Auth tables for session management
- Prisma client generates to `../generated/prisma` directory
