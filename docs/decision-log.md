# Decision log

## 2026-10-16 — CP-20 Prisma 7.10.1 security maintenance

- **Decision:** pin `prisma`, `@prisma/client`, and `@prisma/adapter-pg` together at 7.10.1 rather than moving to Prisma 8 release candidates.
- **Reason:** the prior 7.10.0 production dependency tree had transitive audit findings; 7.10.1 resolves them while retaining the declared Prisma 7 compatibility line. The currently advertised Prisma 8 package is a release candidate and is outside the project's no-prerelease maintenance policy.
- **Evidence:** local `npm audit --omit=dev` reported zero vulnerabilities; client generation, lint, strict TypeScript, 27 unit tests, production build, and 33 responsive browser checks passed before the change was committed.

## 2026-10-15 — CP-01 JavaScript stack baseline

- **Decision:** use npm, Next.js 16.4.1, React 19.3.1, TypeScript 5.9.3, Tailwind CSS 4.1.16, Zod 4.1.12, Vitest 4.0.8 and Playwright 1.57.0.
- **Reason:** `pnpm` is unavailable; npm is supported by the installed Node 22.18.0. Versions are pinned for reproducible installation rather than blindly accepting future breaking majors.
- **Prisma direction:** use the supported Prisma 7 line, not Prisma 8 release candidates. Prisma’s current PostgreSQL documentation requires a driver adapter in Prisma 7; CP-03 will add `@prisma/adapter-pg` and `pg`.
- **Evidence:** official [Prisma PostgreSQL documentation](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql), [Prisma 7 documentation](https://www.prisma.io/docs/orm/v7), and [Prisma release status](https://www.prisma.io/docs/orm/release-status) were checked on 2026-10-15.
