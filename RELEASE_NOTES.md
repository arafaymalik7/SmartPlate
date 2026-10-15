# SMARTPLATE release notes (draft)

## Current status

**FUNCTIONAL BUT PARTIALLY UNVERIFIED.** The Next.js application builds, static/unit checks pass, and public production-browser journeys have real responsive evidence. Authenticated admin persistence and deployment still need the stated external environments before a release can be verified.

GitHub Actions has successfully exercised the committed migration/seed workflow against an ephemeral PostgreSQL service through commit `50981b4`; newer queued runs are not claimed until they finish. Local Docker execution, authenticated admin persistence and deployment remain unverified.

The local Docker Desktop service is stopped and Windows denied the normal service-start attempt, so its Linux containers engine must be started by the desktop user (or a disposable PostgreSQL `DATABASE_URL` and `DIRECT_URL` must be supplied) before database acceptance checks can run.

## Included

- Public illustrative restaurant/menu, comparison and recommendation routes.
- Deterministic recommendation eligibility, ranking and unknown-allergen handling.
- Auth.js-based protected admin foundation, validated restaurant/category/menu-item creation UI and APIs, audit feed, origin checks and basic in-process mutation limit.
- PostgreSQL/Prisma schema, committed baseline migration and idempotent illustrative seed implementation.
- Responsive Playwright coverage (24 current checks) and CI workflow configuration with a confirmed PostgreSQL migration/seed run.

## Not a medical or restaurant-data claim

All current menu venues and nutrition values are illustrative. Missing information remains unavailable and never means allergy-safe or clinically appropriate.
