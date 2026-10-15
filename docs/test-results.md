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
