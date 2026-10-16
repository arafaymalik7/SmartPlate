# Testing

## Verified locally

- `npm run lint` completes with zero warnings.
- `npm run typecheck` completes under strict TypeScript.
- `npm run db:generate` generated Prisma Client 7.10.1 from the committed schema and migration baseline without a database connection.
- `npm audit --omit=dev` reported zero production dependency vulnerabilities after the Prisma 7.10.1 remediation.
- `npm test` contains 27 deterministic Vitest checks for health, illustrative/public catalog data, recommendation eligibility/ranking, preference validation, admin validation/disclosure/category lifecycle defaults, password verification, mutation-origin behaviour, rate limiting, admin-summary completeness, and sign-out success/failure recovery. The provenance validator additionally requires a URL, citation and valid review date before non-illustrative nutrition can be saved.
- `npm run test:e2e` runs eleven production-build Playwright journeys across 375px, 768px and 1440px (33 checks). It covers public discovery, accessible venue-image fallback, bounded comparison, keyboard skip navigation, crawl metadata, rendered internal-link/image integrity, protected unauthenticated admin API/route access, directory/menu filtering, menu-detail provenance/review context, and the allergy-related unknown-disclosure safety state.
- `npm run test:e2e:admin` is a credential-gated desktop browser journey for the disposable CI database. It rejects invalid credentials, then verifies sign-in, protected restaurant/category/menu creation, public publication visibility, menu editing, archive removal, audit evidence, and sign-out. It is intentionally skipped outside CI unless temporary `E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD` values are supplied.

## Configured but awaiting PostgreSQL

The GitHub Actions workflow provisions an ephemeral PostgreSQL 16 service, runs the committed migration and seed, repeats the seed, verifies expected row counts, published catalog facts, publication visibility mutations, and database-backed recommendation generation, then runs lint/typecheck/unit/build/browser checks. CI run #67 for `9fbb17d` completed successfully after the Prisma 7.10.1 remediation, including the full 27-case unit suite and 33-check browser suite: https://github.com/arafaymalik7/SmartPlate/actions/runs/38881168977. Local migration deployment and authenticated admin CRUD are still unverified because Docker Desktop's Linux engine is stopped.

Never use a production database for test migration or seed verification.
