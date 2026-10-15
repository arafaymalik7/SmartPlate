# Test results

## CP-01

- `npm run typecheck`: passed.
- `npm test`: passed, 1 test file / 1 test.
- `npm run build`: passed; routes generated were `/`, `/_not-found`, `/api/health`, `/status`.
- `npm run lint`: passed with zero warnings after configuration cleanup.

## CP-02

- `npm run lint`: passed with zero warnings.
- `npm run typecheck`: passed.
- `npm test`: passed, 1 test file / 1 test.
- `npm run build`: passed.
- Visual/browser checks: UNVERIFIED; browser automation is unavailable in the current runtime.

## CP-03

- `npm run db:generate`: passed, Prisma Client 7.10.0 generated.
- `npm run typecheck`: passed.
- PostgreSQL migration/constraint checks: UNVERIFIED; no development database URL was supplied.

## Browser E2E attempt

- `npm run test:e2e` was executed with two public-route Playwright tests.
- Result: 0/2 completed because Playwright could not find `chromium_headless_shell-1200`; no browser page was opened and no screenshot is claimed.
- A Chromium installation was started; the required headless-shell download did not complete during the observed runtime.

## Browser E2E verification (resolved)

- Playwright now discovers an installed full Chromium executable when the optional headless-shell bundle is unavailable.
- `npm run test:e2e`: passed, 6/6 across `mobile-375`, `tablet-768`, and `desktop-1440` projects against a production build.
- Captures: `docs/evidence/mobile-375-restaurants.png`, `docs/evidence/tablet-768-restaurants.png`, and `docs/evidence/desktop-1440-restaurants.png`; each was visually inspected. The prior 0/2 attempt remains above as historical evidence, not the current result.

## Preference safety journey

- `npm run test:e2e`: passed, 9/9 after adding the strict allergy-related exclusion journey at each viewport.
- Acceptance criterion: an incomplete allergen disclosure is grouped as “Unable to verify” and is explicitly not marked safe.
- Visual evidence: `docs/evidence/mobile-375-recommendations.png`, `docs/evidence/tablet-768-recommendations.png`, and `docs/evidence/desktop-1440-recommendations.png`; the mobile capture was visually reviewed.

## Restaurant directory filtering

- `npm run test:e2e`: passed, 12/12 after adding restaurant query/no-results/reset coverage at all three viewports.
- The refreshed `docs/evidence/desktop-1440-restaurants.png` capture was visually reviewed after the filter controls were added.

## Menu browsing and disclosure

- `npm run test:e2e`: passed, 15/15 after adding menu search, verified-diet filter, no-results/reset and responsive capture coverage.
- `npm test`: includes a data-shape assertion for four fictional venues and 48 illustrative menu records, plus null-nutrition preservation.
- Visual evidence: `docs/evidence/mobile-375-menu-filters.png`, `docs/evidence/tablet-768-menu-filters.png`, `docs/evidence/desktop-1440-menu-filters.png`; mobile was visually inspected.

## Admin validation increment

- `npm test`: passed, 12/12. Admin schemas reject negative prices, malformed provenance URLs and invalid category slugs.
- `npm run lint` and `npm run typecheck`: passed after adding guarded category/menu-item route handlers and audit summary counts.
- Database-backed route execution is UNVERIFIED because no disposable PostgreSQL server is available locally.

## Mutation origin guard

- `npm test`: passed, 14/14 including same-origin, no-origin, cross-origin and malformed-origin mutation cases.
- `npm run lint`, `npm run typecheck` and `npm run build`: passed after the guard was added to all current admin POST routes.
