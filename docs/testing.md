# Testing

## Verified locally

- `npm run lint` completes with zero warnings.
- `npm run typecheck` completes under strict TypeScript.
- `npm run db:generate` generated Prisma Client 7.10.0 from the committed schema and migration baseline without a database connection.
- `npm test` runs 14 deterministic Vitest checks for health, illustrative data, recommendation eligibility/ranking, preference validation, admin validation, password verification and mutation-origin behaviour.
- `npm run test:e2e` runs eight production-build Playwright journeys across 375px, 768px and 1440px (24 checks). It covers public discovery, bounded comparison, keyboard skip navigation, crawl metadata, protected unauthenticated admin access, directory/menu filtering and the allergy-related unknown-disclosure safety state.

## Configured but awaiting PostgreSQL

The GitHub Actions workflow provisions an ephemeral PostgreSQL 16 service, runs the committed migration and seed, then lint/typecheck/unit/build/browser checks. CI run #20 for commit `50981b4` was confirmed successful from the public workflow feed. Local migration deployment, idempotent repeated seeding and authenticated admin CRUD are still unverified because Docker Desktop's Linux engine is stopped.

Never use a production database for test migration or seed verification.
