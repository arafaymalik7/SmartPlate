# Testing

## Verified locally

- `npm run lint` completes with zero warnings.
- `npm run typecheck` completes under strict TypeScript.
- `npm run db:generate` generated Prisma Client 7.10.0 from the committed schema and migration baseline without a database connection.
- `npm test` runs 26 deterministic Vitest checks for health, illustrative/public catalog data, recommendation eligibility/ranking, preference validation, admin validation/disclosure/category lifecycle defaults, password verification, mutation-origin behaviour, rate limiting, admin-summary completeness, and sign-out success/failure recovery.
- `npm run test:e2e` runs eight production-build Playwright journeys across 375px, 768px and 1440px (24 checks). It covers public discovery, bounded comparison, keyboard skip navigation, crawl metadata, protected unauthenticated admin access, directory/menu filtering and the allergy-related unknown-disclosure safety state.

## Configured but awaiting PostgreSQL

The GitHub Actions workflow provisions an ephemeral PostgreSQL 16 service, runs the committed migration and seed, repeats the seed, verifies expected row counts, published catalog facts, publication visibility mutations, and database-backed recommendation generation, then runs lint/typecheck/unit/build/browser checks. CI run #50 for commit `7891aa6` completed successfully, and CI run #55 for `b0d2283` completed successfully. Local migration deployment and authenticated admin CRUD are still unverified because Docker Desktop's Linux engine is stopped.

Never use a production database for test migration or seed verification.
