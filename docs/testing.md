# Testing

## Verified locally

- `npm run lint` completes with zero warnings.
- `npm run typecheck` completes under strict TypeScript.
- `npm run db:generate` generated Prisma Client 7.10.0 from the committed schema and migration baseline without a database connection.
- `npm test` runs 19 deterministic Vitest checks for health, illustrative data, recommendation eligibility/ranking, preference validation, admin validation/disclosure/category lifecycle defaults, password verification, mutation-origin behaviour and admin mutation rate limiting.
- `npm run test:e2e` runs eight production-build Playwright journeys across 375px, 768px and 1440px (24 checks). It covers public discovery, bounded comparison, keyboard skip navigation, crawl metadata, protected unauthenticated admin access, directory/menu filtering and the allergy-related unknown-disclosure safety state.

## Configured but awaiting PostgreSQL

The GitHub Actions workflow provisions an ephemeral PostgreSQL 16 service, runs the committed migration and seed, repeats the seed, verifies the expected 4/4/48/48 row counts, then runs lint/typecheck/unit/build/browser checks. CI run #32 for commit `91f566a` completed successfully in 2m56s, verifying the expanded repeat-seed assertion. Local migration deployment and authenticated admin CRUD are still unverified because Docker Desktop's Linux engine is stopped.

Never use a production database for test migration or seed verification.
