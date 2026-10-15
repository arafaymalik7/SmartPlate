# Testing

## Verified locally

- `npm run lint` completes with zero warnings.
- `npm run typecheck` completes under strict TypeScript.
- `npm run db:generate` generated Prisma Client 7.10.0 from the committed schema and migration baseline without a database connection.
- `npm test` runs 10 deterministic Vitest checks for health, illustrative data, recommendation eligibility/ranking, preference validation, admin validation and password verification.
- `npm run test:e2e` runs nine production-build Playwright checks across 375px, 768px and 1440px. It covers public discovery, missing nutrient comparison and the allergy-related unknown-disclosure safety state.

## Configured but awaiting PostgreSQL

The GitHub Actions workflow provisions an ephemeral PostgreSQL 16 service, runs the committed migration and seed, then lint/typecheck/unit/build/browser checks. Its remote execution result is not known from this environment. Local migration deployment, idempotent repeated seeding and authenticated admin CRUD are also unverified because Docker Desktop's Linux engine is stopped.

Never use a production database for test migration or seed verification.
