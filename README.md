# SMARTPLATE

**SMARTPLATE: A Web-Based Intelligent System for Analyzing Restaurant Menus and Providing Personalized Nutrition and Health-Aware Meal Recommendations.**

SMARTPLATE is being delivered as a Next.js, TypeScript, PostgreSQL and Prisma university project. Its public experience provides fictional, clearly labelled illustrative menu data; deterministic, explainable preference-based suggestions; and per-serving comparison. It is informational only—not medical advice or allergy-safety certification.

## Current status

The active branch is `codex/smartplate-complete`. Public menu routes, preference validation, a tested recommendation engine, comparison, Prisma schema, illustrative seed blueprint, guarded admin foundation, CI workflow and operational documentation are implemented. Real Playwright browser evidence is captured at 375px, 768px and 1440px under `docs/evidence/`. GitHub Actions CI #62 for `f3500af` verified migration deployment, double seeding, catalog/visibility/recommendation checks, the full 27-case unit suite, production build, and 33 browser checks against ephemeral PostgreSQL. Authenticated database-backed administration and cloud deployment remain unverified until appropriate database/cloud access is supplied. See `docs/implementation-progress.md` for checkpoint evidence.

## Local setup

1. Install Node.js 22.18+ and PostgreSQL.
2. Copy `.env.example` to `.env` and set local, non-production `DATABASE_URL` and `DIRECT_URL`. Set `NEXT_PUBLIC_APP_URL` to the actual HTTPS origin when deploying.
3. Run `npm ci`, `npm run db:generate`, `npm run db:migrate`, `npm run db:seed`, and `npm run dev`.

## Verification

```text
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

After an actual HTTPS deployment, run `npm run verify:public-url -- https://your-smartplate.example`. The command is a public smoke check and does not itself prove authenticated administration or database acceptance.

## Data integrity

- Demonstration records are fictional and nutrition values are illustrative.
- Missing nutrients show as `Not available`, never zero.
- Unknown allergen disclosure is not an absence/safety claim.
- Guest preferences are limited to non-sensitive meal controls.
- Never commit `.env` secrets or university private reference materials.
