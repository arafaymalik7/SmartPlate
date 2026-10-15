# Architecture

SMARTPLATE is a Next.js App Router web application. Server routes and server components are the boundary for Prisma/PostgreSQL reads and protected mutations. Client components are used only for interactive non-sensitive preference controls.

```text
Browser → Next.js App Router → Zod validation / Auth.js guard → Prisma 7 adapter → PostgreSQL
                         ↘ pure recommendation engine
```

Public routes present illustrative data and transparent uncertainty. The recommendation engine is a pure TypeScript module. Admin API routes call a server-side session guard before dynamically loading Prisma; this keeps production builds possible without embedding database credentials.

The PostgreSQL schema defines users/sessions, restaurants/categories/items, nullable nutrition/provenance, explicit allergen and ingredient disclosure joins, and audit records. See `docs/database.md` and `docs/recommendation-algorithm.md`.

Implementation-derived architecture, ERD, recommendation-flow and admin-sequence diagram sources are in `docs/diagrams.md`.
