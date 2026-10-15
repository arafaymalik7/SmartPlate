# SMARTPLATE release notes (draft)

## Current status

**FUNCTIONAL BUT PARTIALLY UNVERIFIED.** The Next.js application builds, static/unit checks pass, and public production-browser journeys have real responsive evidence. PostgreSQL migration/seed execution, authenticated admin persistence, remote GitHub Actions and deployment need the stated external environments before a release can be verified.

The local Docker Desktop service is stopped and Windows denied the normal service-start attempt, so its Linux containers engine must be started by the desktop user (or a disposable PostgreSQL `DATABASE_URL` and `DIRECT_URL` must be supplied) before database acceptance checks can run.

## Included

- Public illustrative restaurant/menu, comparison and recommendation routes.
- Deterministic recommendation eligibility, ranking and unknown-allergen handling.
- Auth.js-based protected admin foundation, validated restaurant create API and audit-log write path.
- PostgreSQL/Prisma schema, committed baseline migration and idempotent illustrative seed implementation.
- Responsive Playwright coverage and CI workflow configuration.

## Not a medical or restaurant-data claim

All current menu venues and nutrition values are illustrative. Missing information remains unavailable and never means allergy-safe or clinically appropriate.
