# CP-04–CP-23 release evidence matrix

Status meanings: **verified** has the listed local/remote evidence; **partial**
means code exists but a required database/auth/deployment acceptance check is
still unavailable; **blocked** needs external authority or credentials. This is
not a claim of university acceptance or a production release.

| CP  | Delivered evidence                                                                                            | Status                          | Principal commits / verification                                                                             |
| --- | ------------------------------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 04  | Four fictional restaurants and 48 illustrative dishes; idempotent Prisma seed                                 | Verified in CI                  | `336ec44`, `91f566a`; CI #32 ran migration, seed twice, and a 4/4/48/48 PostgreSQL count assertion           |
| 05  | Responsive landing and shared navigation                                                                      | Verified (public UI)            | `5f5330d`; Playwright responsive evidence                                                                    |
| 06  | Searchable bounded restaurant directory and empty state                                                       | Partial (CI database verified)  | `e5d8785`; CI run #43 verified the PostgreSQL-backed published directory has 4 restaurants; no live hosted DB acceptance yet |
| 07  | Restaurant/menu routes and not-found handling                                                                 | Partial (CI database verified)  | `e5d8785`; CI run #43 verified 48 published menu items and a verified vegan item through the public catalog; no live hosted DB acceptance yet |
| 08  | Dish nutrition, source, ingredient/allergen uncertainty and unavailable states                                | Verified (illustrative UI)      | `8f565c5`, `46a09c6`; Playwright/unit evidence                                                               |
| 09  | Menu search/category/diet/sort filters and empty/reset states                                                 | Verified (illustrative UI)      | `46a09c6`; Playwright 24/24 latest suite                                                                     |
| 10  | Validated preference controls, safe browser persistence boundaries, reset                                     | Verified (public UI)            | `70e5705`, `118b948`; unit/Playwright evidence                                                               |
| 11  | Pure hard-exclusion/unknown-allergen eligibility rules                                                        | Verified                        | `135edfa`; deterministic unit coverage                                                                       |
| 12  | Deterministic scoring, explanations, missing-data treatment                                                   | Verified                        | `135edfa`; deterministic unit coverage                                                                       |
| 13  | Recommendation results and caveats UI                                                                         | Partial (CI database verified)  | `7891aa6`; CI #50 passed recommendations generated from the seeded PostgreSQL catalog, while live hosted acceptance remains outstanding |
| 14  | Bounded 2–3 meal comparison with unavailable values                                                           | Verified (illustrative UI)      | `e6dc08f`; Playwright screenshots at three viewports; `e5d8785` also verifies its public catalog source in CI |
| 15  | Auth.js credentials foundation, bootstrap, guards and protected no-session route                              | Partial                         | `bdab92d`, `309337e`; no real admin/database login/logout acceptance run                                     |
| 16  | Guarded restaurant/category create/read, publication lifecycle, and full update routes with audit records     | Partial (CI visibility verified)| `6144fef`; CI #49 proved draft restaurant/category data disappears from PostgreSQL-backed public catalog; authenticated admin acceptance remains outstanding |
| 17  | Guarded menu/nutrition creation and full update route with disclosure/nutrition replacement and audit history | Partial                         | `cd26f0b`; run #47 passed the PostgreSQL/seed/catalog/unit/build/browser workflow; editable UI and audit update are implemented, while authenticated PostgreSQL acceptance remains outstanding |
| 18  | Truthful summary counters and latest audit feed                                                               | Partial                         | `def9e12`; missing-nutrition count now includes absent relations and null fields with focused unit coverage; authenticated persistence remains outstanding |
| 19  | Responsive, keyboard, metadata, robots/sitemap and screenshot checks                                          | Verified (covered public scope) | `7f03aa6`, `50981b4`; latest Playwright 24/24                                                                |
| 20  | Zod, origin checks, safe errors, secret scan process and basic write limit                                    | Partial                         | `0591635`, `4316083`; distributed rate limiting/authenticated attack testing still needs deployment/database |
| 21  | CI PostgreSQL service, migration/seed, static/unit/build/browser sequence                                     | Verified through CI #50         | `7891aa6`; CI #49/#50 additionally exercised publication visibility and database-backed recommendations after migration/seed, then passed lint/type/unit/build and 24 fallback browser checks |
| 22  | Vercel-compatible runbook and HTTPS public smoke-check script                                                 | Blocked                         | `ac38ce0`; deployment needs hosting/database credentials and public URL                                      |
| 23  | Report draft, source register, diagrams, presentation outline, QA/release docs                                | Partial                         | `c2f62d2`, `ac38ce0`; genuine user testing, supervisor review and institutional formatting remain required   |

## Current verification snapshot

At commit `06e280b`, a clean `npm ci` install was followed by local lint,
strict TypeScript, 16 Vitest checks, and the
production build passed. The latest public Playwright run passed 24 checks
across 375px, 768px, and 1440px. The pushed branch is
`codex/smartplate-complete`; use `git ls-remote --heads origin
codex/smartplate-complete` to confirm its current remote SHA before release.

## Required human inputs to remove the remaining limits

1. A disposable/managed PostgreSQL `DATABASE_URL` and `DIRECT_URL`, plus an
   `AUTH_SECRET` and a deliberately bootstrapped administrator for database and
   authenticated acceptance checks.
2. A hosting project with environment-variable permission and a public HTTPS
   URL for deployment smoke testing.
3. Genuine user-testing protocol/results, supervisor feedback, and the
   university's required report template/sign-off process.
