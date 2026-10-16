# CP-04–CP-23 release evidence matrix

Status meanings: **verified** has the listed local/remote evidence; **partial**
means code exists but a required database/auth/deployment acceptance check is
still unavailable; **blocked** needs external authority or credentials. This is
not a claim of university acceptance or a production release.

| CP  | Delivered evidence                                                                                                  | Status                           | Principal commits / verification                                                                                                                                                                      |
| --- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 04  | Four fictional restaurants and 48 illustrative dishes; idempotent Prisma seed                                       | Verified in CI                   | `336ec44`, `91f566a`; CI #32 ran migration, seed twice, and a 4/4/48/48 PostgreSQL count assertion                                                                                                    |
| 05  | Responsive landing and shared navigation                                                                            | Verified (public UI)             | `5f5330d`; Playwright responsive evidence                                                                                                                                                             |
| 06  | Searchable bounded restaurant directory and empty state                                                             | Partial (CI database verified)   | `4ac657d`; CI #65 passed accessible fallback coverage and the PostgreSQL-backed published directory verification; no live hosted DB acceptance yet                                                    |
| 07  | Restaurant/menu routes and not-found handling                                                                       | Partial (CI database verified)   | `e5d8785`; CI run #43 verified 48 published menu items and a verified vegan item through the public catalog; no live hosted DB acceptance yet                                                         |
| 08  | Dish nutrition, source, ingredient/allergen uncertainty and unavailable states                                      | Verified (illustrative UI)       | `f3500af`; CI #62 passed the source-provenance unit suite and 33/33 browser checks; reviewed responsive menu-detail captures are committed                                                            |
| 09  | Menu search/category/diet/sort filters and empty/reset states                                                       | Verified (illustrative UI)       | `46a09c6`; Playwright 24/24 latest suite                                                                                                                                                              |
| 10  | Validated preference controls, safe browser persistence boundaries, reset                                           | Verified (public UI)             | `70e5705`, `118b948`; unit/Playwright evidence                                                                                                                                                        |
| 11  | Pure hard-exclusion/unknown-allergen eligibility rules                                                              | Verified                         | `135edfa`; deterministic unit coverage                                                                                                                                                                |
| 12  | Deterministic scoring, explanations, missing-data treatment                                                         | Verified                         | `135edfa`; deterministic unit coverage                                                                                                                                                                |
| 13  | Recommendation results and caveats UI                                                                               | Partial (CI database verified)   | `7891aa6`; CI #50 passed recommendations generated from the seeded PostgreSQL catalog, while live hosted acceptance remains outstanding                                                               |
| 14  | Bounded 2–3 meal comparison with unavailable values                                                                 | Verified (illustrative UI)       | `e6dc08f`; Playwright screenshots at three viewports; `e5d8785` also verifies its public catalog source in CI                                                                                         |
| 15  | Auth.js credentials foundation, bootstrap, guards and protected no-session route                                    | Partial                          | `f345107`; CI #60 passed direct unauthenticated admin read/mutation (`401`) and hostile-origin (`403`) browser checks, but real administrator/database login and logout acceptance remain outstanding |
| 16  | Guarded restaurant/category create/read, publication lifecycle, and full update routes with audit records           | Partial (CI visibility verified) | `f345107`; CI #60 reran the PostgreSQL visibility workflow and direct unauthenticated-admin checks; authenticated admin acceptance remains outstanding                                                |
| 17  | Guarded menu/nutrition creation and full update route with disclosure/nutrition replacement and audit history       | Partial                          | `f3500af`; CI #62 passed the full PostgreSQL workflow after source URL/citation/review-date validation and persistence were added; authenticated PostgreSQL acceptance remains outstanding            |
| 18  | Truthful summary counters and latest audit feed                                                                     | Partial (CI verified)            | `def9e12`; CI #51 passed the missing-nutrition counter correction; authenticated persistence remains outstanding                                                                                      |
| 19  | Responsive, keyboard, metadata, robots/sitemap and screenshot checks                                                | Verified (covered public scope)  | `f3500af`; CI #62 passed 33/33 at three viewports, including visually inspected menu-detail captures; authenticated admin keyboard testing remains unavailable                                        |
| 20  | Zod, origin checks, safe errors, secret scan process, basic write limit, and patched Prisma production dependencies | Partial                          | `0591635`, `4316083`; Prisma 7.10.1 local audit reported zero production vulnerabilities. Distributed rate limiting/authenticated attack testing still needs deployment/database                      |
| 21  | CI PostgreSQL service, migration/seed, static/unit/build/browser sequence                                           | Verified through CI #62          | `f3500af`; CI #62 reran migration, double seed, catalog/visibility/recommendation checks, lint/type/unit/build, and 33 fallback browser checks                                                        |
| 22  | Vercel-compatible runbook and HTTPS public smoke-check script                                                       | Blocked                          | `ac38ce0`; deployment needs hosting/database credentials and public URL                                                                                                                               |
| 23  | Report draft, source register, diagrams, presentation outline, QA/release docs                                      | Partial                          | `c2f62d2`, `ac38ce0`; genuine user testing, supervisor review and institutional formatting remain required                                                                                            |

## Current verification snapshot

At code commit `f3500af`, local lint, strict TypeScript, a focused 7-test
provenance validation file, the production build, and 33 public/unauthenticated-admin
Playwright checks passed across 375px, 768px, and 1440px. GitHub Actions CI #62
independently passed its PostgreSQL migration, double seed, catalog, visibility,
recommendation, full 27-test unit, build, and 33-browser-check sequence:
https://github.com/arafaymalik7/SmartPlate/actions/runs/38793976765. The
pushed branch is `codex/smartplate-complete`; use `git ls-remote --heads
origin codex/smartplate-complete` to confirm its current remote SHA before
release. The subsequent Prisma 7.10.1 security remediation passed its full local
test suite and production dependency audit; its clean-install CI run is recorded
only after it completes.

## Required human inputs to remove the remaining limits

1. A disposable/managed PostgreSQL `DATABASE_URL` and `DIRECT_URL`, plus an
   `AUTH_SECRET` and a deliberately bootstrapped administrator for database and
   authenticated acceptance checks.
2. A hosting project with environment-variable permission and a public HTTPS
   URL for deployment smoke testing.
3. Genuine user-testing protocol/results, supervisor feedback, and the
   university's required report template/sign-off process.
