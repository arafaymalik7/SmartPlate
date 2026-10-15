# SMARTPLATE delivery plan

## Baseline

The tracked baseline is a clean legacy FastAPI/SQLite project on `main` with `origin` set to `https://github.com/arafaymalik7/SmartPlate.git`. The replacement application will be developed on `codex/smartplate-complete`; the old runtime remains intact for provenance and rollback.

## Delivery sequence

1. CP-00: intake, requirements, governance and evidence ledger.
2. CP-01 to CP-04: create the Next.js toolchain, design foundations, PostgreSQL/Prisma data model and idempotent illustrative dataset.
3. CP-05 to CP-14: public menu discovery, preference and recommendation journeys.
4. CP-15 to CP-18: authenticated administration and auditability.
5. CP-19 to CP-23: quality/security audits, CI, deployment runbook and academic evidence package.

## Constraints and external prerequisites

- `docs/university/reference/` is not present; the master prompt remains the usable requirements source.
- `pnpm` and GitHub CLI are unavailable. npm will be used locally. Git can push only if the configured HTTPS remote has usable credentials.
- A PostgreSQL `DATABASE_URL` or Docker PostgreSQL must be available before DB-backed integration/browser tests can be verified. No credential values have been inspected or recorded.
- Vercel/managed PostgreSQL deployment requires the repository owner’s cloud credentials; documentation can proceed without them.

## Non-negotiable evidence practice

Every checkpoint is logged with actual commands/results, a local commit SHA, and the independently verified push result. `BLOCKED`/`UNVERIFIED` are used instead of inferred success.
