# SMARTPLATE engineering guide

## Scope

Build SMARTPLATE as a Next.js App Router + TypeScript + PostgreSQL + Prisma web application. The legacy FastAPI/SQLite implementation is retained as historical reference only and must not be modified or used as the new runtime.

## Safety and data integrity

- All seed restaurants, prices, nutrition values and source metadata are fictional/illustrative unless an actual traceable source is recorded.
- Missing nutrition is `null`/`Not available`, never zero. Missing allergen or ingredient disclosure is unknown, never safe.
- Do not collect diagnoses, health records, or personal health profiles. Preferences are informational only.
- Keep `docs/university/reference/`, `.env*` secrets, credentials and personal data out of Git.
- Never hard-code passwords, tokens, database URLs, or admin credentials.

## Stack and code conventions

- Next.js App Router, React, strict TypeScript, Tailwind CSS, Prisma/PostgreSQL, Zod, Vitest and Playwright.
- Use server-side authorization for every admin read or mutation; never rely on UI hiding.
- Keep recommendation logic pure, deterministic, typed and separately unit tested.
- Use Prettier and ESLint. Prefer focused components and `src/lib` service modules over route-sized business logic.

## Verification

Use the package scripts: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e`, and the documented Prisma scripts. Run the relevant tests for each checkpoint; UI changes require actual browser screenshots at 375px, 768px and 1440px when browser/database prerequisites are available.

## Checkpoint protocol

For CP-00 through CP-23: implement a focused vertical slice, add/update tests, run checks, review Git status and secret patterns, update `docs/implementation-progress.md`, commit with a conventional message, and push the current branch. Record a local commit and `GIT-PUSH-BLOCKED` truthfully when remote access is unavailable.
