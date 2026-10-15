# CP-04–CP-23 release evidence matrix

Status meanings: **verified** has the listed local/remote evidence; **partial**
means code exists but a required database/auth/deployment acceptance check is
still unavailable; **blocked** needs external authority or credentials. This is
not a claim of university acceptance or a production release.

| CP  | Delivered evidence                                                               | Status                          | Principal commits / verification                                                                             |
| --- | -------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 04  | Four fictional restaurants and 48 illustrative dishes; idempotent Prisma seed    | Partial                         | `336ec44`; CI #20 ran migration/seed on PostgreSQL 16; repeat-seed check still needs a database              |
| 05  | Responsive landing and shared navigation                                         | Verified (public UI)            | `5f5330d`; Playwright responsive evidence                                                                    |
| 06  | Searchable bounded restaurant directory and empty state                          | Partial                         | `458227c`; UI verified, database read path awaits supplied PostgreSQL                                        |
| 07  | Restaurant/menu routes and not-found handling                                    | Partial                         | `8f565c5`, `46a09c6`; UI verified, database read path awaits supplied PostgreSQL                             |
| 08  | Dish nutrition, source, ingredient/allergen uncertainty and unavailable states   | Verified (illustrative UI)      | `8f565c5`, `46a09c6`; Playwright/unit evidence                                                               |
| 09  | Menu search/category/diet/sort filters and empty/reset states                    | Verified (illustrative UI)      | `46a09c6`; Playwright 24/24 latest suite                                                                     |
| 10  | Validated preference controls, safe browser persistence boundaries, reset        | Verified (public UI)            | `70e5705`, `118b948`; unit/Playwright evidence                                                               |
| 11  | Pure hard-exclusion/unknown-allergen eligibility rules                           | Verified                        | `135edfa`; deterministic unit coverage                                                                       |
| 12  | Deterministic scoring, explanations, missing-data treatment                      | Verified                        | `135edfa`; deterministic unit coverage                                                                       |
| 13  | Recommendation results and caveats UI                                            | Partial                         | `118b948`; illustrative UI verified, PostgreSQL candidate path awaits supplied database                      |
| 14  | Bounded 2–3 meal comparison with unavailable values                              | Verified (illustrative UI)      | `e6dc08f`; Playwright screenshots at three viewports                                                         |
| 15  | Auth.js credentials foundation, bootstrap, guards and protected no-session route | Partial                         | `bdab92d`, `309337e`; no real admin/database login/logout acceptance run                                     |
| 16  | Guarded restaurant/category create/read workflow                                 | Partial                         | `2f87e05`, `309337e`; create UI exists, full edit/archive/delete acceptance remains outstanding              |
| 17  | Guarded menu-item/nutrition create/read workflow                                 | Partial                         | `2f87e05`, `309337e`; ingredient/allergen editor and full lifecycle remain outstanding                       |
| 18  | Truthful summary counters and latest audit feed                                  | Partial                         | `2f87e05`, `309337e`; persistence needs authenticated PostgreSQL test                                        |
| 19  | Responsive, keyboard, metadata, robots/sitemap and screenshot checks             | Verified (covered public scope) | `7f03aa6`, `50981b4`; latest Playwright 24/24                                                                |
| 20  | Zod, origin checks, safe errors, secret scan process and basic write limit       | Partial                         | `0591635`, `4316083`; distributed rate limiting/authenticated attack testing still needs deployment/database |
| 21  | CI PostgreSQL service, migration/seed, static/unit/build/browser sequence        | Verified through CI #20         | `0b35e64`, `50981b4`; later workflow states not claimed here                                                 |
| 22  | Vercel-compatible runbook and HTTPS public smoke-check script                    | Blocked                         | `ac38ce0`; deployment needs hosting/database credentials and public URL                                      |
| 23  | Report draft, source register, diagrams, presentation outline, QA/release docs   | Partial                         | `c2f62d2`, `ac38ce0`; genuine user testing, supervisor review and institutional formatting remain required   |

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
