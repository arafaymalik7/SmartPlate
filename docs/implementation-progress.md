# Implementation progress ledger

## CP-15 — Admin sign-out increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Implementation: authenticated administrator workspace now presents a keyboard-accessible sign-out action that invokes Auth.js sign-out and returns to the protected sign-in route while preventing duplicate clicks.
- Verification: focused client test plus `npm run lint`, `npm run typecheck`, `npm test` (12 files, 25 tests), `npm run build` (20 routes), and `npm run test:e2e -- --reporter=line` (24 passed at 375px, 768px, and 1440px) all passed before commit. End-to-end sign-in/sign-out still requires the supplied administrator and PostgreSQL credentials.
## CP-06/07/08 — Database-source labeling correction

- Timestamp: 2026-10-15 (Asia/Karachi)
- Implementation: public restaurant and menu-detail pages now use one mutually exclusive source label. Database-backed records say “Published”, while the fallback says “Illustrative”; detail provenance copy also distinguishes illustrative nutrition from published source types.
- Verification: `npm run lint`, `npm run typecheck`, `npm test` (11 files, 24 tests), `npm run build` (20 routes), and `npm run test:e2e -- --reporter=line` (24 passed at 375px, 768px, and 1440px) passed before commit.

## CP-21 — Isolated Playwright server increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Implementation: Playwright now always starts and owns its configured production server rather than reusing an arbitrary process on port 3000. This prevents a second run from attaching to a stopping server and producing connection-refused failures across otherwise unrelated browser cases.
- Verification: `npm run lint`, `npm run typecheck`, `npm test` (11 files, 24 tests), `npm run build` (20 routes), and a clean `npm run test:e2e -- --reporter=line` (24 passed at 375px, 768px, and 1440px) all passed after the isolated-server change.

## CP-18 — Complete nutrition counter increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Implementation: the admin completeness count now includes menu items with no nutrition relation as well as nutrition records with missing calories or sodium, so an absent row cannot be misleadingly omitted from the missing-data total.
- Verification: a focused Vitest assertion covers the Prisma relation/null filter. `npm run lint`, `npm run typecheck`, `npm test` (11 files, 24 tests), `npm run build` (20 routes), and `npm run test:e2e -- --reporter=line` (24 passed at 375px, 768px, and 1440px) passed before commit.

## CP-16/17 — Public publication-visibility verification increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Implementation: public catalog reads now require a published restaurant, published and available item, and either no category or a published category. A disposable-PostgreSQL verifier confirms the actual catalog can drive the recommendation engine, then toggles one seeded record through draft item, unavailable item, draft category, and draft restaurant states, asserting it disappears from public results after each change and always restores the original values.
- Verification: `npm run lint`, `npm run typecheck`, `npm test` (10 files, 23 tests), `npm run build` (20 routes), and `npm run test:e2e -- --reporter=line` (24 passed at 375px, 768px, and 1440px) all passed. CI run #49 for `6144fef311421824cb40e9d23a0e03430a3399a8` passed the disposable PostgreSQL visibility mutations: https://github.com/arafaymalik7/SmartPlate/actions/runs/38786850036. CI run #50 for `7891aa6fde79c688168cf562c1c103b1d28b1c8a` also passed its database-catalog recommendation assertion: https://github.com/arafaymalik7/SmartPlate/actions/runs/38787107587.

## CP-17 — Editable menu record increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Implementation: the protected menu list API now returns the record fields needed for a lossless edit. The admin editor now supports revising an existing item’s restaurant/category, availability, nutrition values and units, provenance, ingredient/allergen disclosures, and publication status through the existing guarded full-update route; the route replaces disclosures, upserts nutrition, and writes an audit event.
- Verification: `npm run lint`, `npm run typecheck`, `npm test` (10 files, 23 tests), `npm run build` (20 routes), and `npm run test:e2e -- --reporter=line` (24 passed at 375px, 768px, and 1440px) all passed. Disclosure display-to-edit round-trip coverage was added to Vitest. Commit `cd26f0b1a63c07daf88bf0d86f4fe616e3de1f6f` was also verified by GitHub Actions run #47: https://github.com/arafaymalik7/SmartPlate/actions/runs/38785786416.
- Limit: there is no supplied administrator credential or persistent local PostgreSQL service, so the authenticated mutation and its post-restart persistence remain unverified in this environment.

## CP-04/06/07/09/13/14/21 — Remote PostgreSQL catalog verification

- Timestamp: 2026-10-15 (Asia/Karachi)
- Verification: GitHub Actions run #43 for `e5d8785d6635734b1d801cf46b25089569f5bbf7` completed successfully: https://github.com/arafaymalik7/SmartPlate/actions/runs/38784140805. It provisioned PostgreSQL, deployed migrations, seeded twice, checked exact seed counts, verified the published catalog contains four restaurants, 48 items, and vegan coverage, then passed lint, strict TypeScript, 20 Vitest checks, production build, and the 24-check fallback Playwright suite.
- Limit: this confirms reproducible ephemeral CI behavior, not an authenticated administrator journey, a user-supplied database, or a production deployment.

## CP-17 — Multi-disclosure entry increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: replaced the single ingredient/allergen inputs in guarded menu-item creation with per-line multi-disclosure textareas. Each line records a normalized name and explicit `PRESENT`, `ABSENT_VERIFIED`, or `UNKNOWN` state; missing or invalid states safely default to unknown.
- Verification: parser unit tests cover multiple explicit states plus unknown fallback; lint, strict TypeScript, and 22 Vitest checks passed. Production build and responsive public Playwright checks are run before the commit; authenticated persistence remains dependent on PostgreSQL/admin access.
- Limit: this is a compact line-oriented editor, not yet a fully interactive row editor for existing records.

## CP-13/14 — Published-catalog consumer increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: moved recommendation and 2–3 item comparison clients onto the server-provided catalog. Published records now keep their ingredient/allergen names and explicit `ABSENT_VERIFIED` state for the deterministic safety engine; client copy identifies published versus illustrative data without calling either allergy-safe. A configured database outage has a dedicated unavailable state rather than an empty recommendation result.
- Verification: lint, strict TypeScript, 20 Vitest checks, production build, and 24 Playwright checks at 375px, 768px, and 1440px passed. Refreshed comparison and recommendation screenshots were captured by those checks.
- Limit: live Prisma reads and authenticated administrator changes still require the unavailable PostgreSQL environment; no medical or allergy-safety claim is made.

## CP-21 — Database-mode browser assertion correction

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: corrected the restaurant empty-state browser assertion to accept the truthful published-data wording used in PostgreSQL-backed CI as well as the demonstration wording used in no-database local fallback mode.
- Verification: lint, strict TypeScript, 20 Vitest checks, production build, and 24 local Playwright checks passed. The preceding catalog CI failures are traceable to the old fallback-only assertion; the pushed correction awaits its new CI result.

## CP-04/09/21 — Dietary seed parity correction

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: made the idempotent illustrative seed assign explicit vegan verification to a bounded subset of dishes and update existing seed rows consistently. This gives the published PostgreSQL catalog the same verified-diet filter scenario exercised by the browser journey.
- Verification: local lint, strict TypeScript, unit, build, and fallback Playwright checks are run before push; the real PostgreSQL seed/browser path is verified only by the next CI run.

## CP-21 — Published-catalog CI separation increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: added a PostgreSQL CI verifier for the real published catalog (four restaurants, 48 items, and vegan coverage) after migration and repeat seeding. Browser snapshots now intentionally run in explicit no-database fallback mode, preserving deterministic UI coverage while the separate verifier proves the database branch.
- Verification: local lint, strict TypeScript, unit, build, and 24 fallback Playwright checks pass. The new remote catalog verifier awaits the pushed CI run.

## CP-06/07/13 — Published-data catalog increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: added a server-side catalog that reads only published restaurants and available published menu items from Prisma when PostgreSQL is configured. Restaurant directory, restaurant menu, and item nutrition routes now consume the catalog; the explicit illustrative fallback remains only for no-database development. A configured-but-unreachable database renders no substituted demo records.
- Verification: fallback behavior is unit-tested; lint, strict TypeScript, 20 Vitest checks, production build, and 24 Playwright checks at 375px, 768px, and 1440px passed. Regenerated mobile and desktop restaurant screenshots were reviewed.
- Limit: this workspace still has no local PostgreSQL service, so the live database branch is CI/runtime-bound rather than locally executed.

## CP-16/17 — Guarded full-update increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: added full validated PATCH support for restaurants, categories, and menu items alongside their lightweight publication-state actions. Restaurant/category console forms now support edit and cancel. A full menu update validates restaurant/category ownership and atomically replaces ingredient/allergen disclosures plus upserts nutrition provenance; every update records changed field names in the audit trail.
- Verification: lint, strict TypeScript, 19 Vitest checks, production build, and 24 public Playwright checks at 375px, 768px, and 1440px passed. The authenticated admin data path remains intentionally unclaimed because no PostgreSQL-backed administrator is configured locally.
- Limit: the menu form remains a focused creation surface rather than a multi-row editor, and authenticated PostgreSQL CRUD acceptance remains outstanding.

## CP-16 — Category publication controls increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: completed the guarded category publication lifecycle with origin-checked, rate-limited status transitions, immutable audit records, and authenticated console controls for publish, unpublish, and confirmation-gated archive.
- Verification: lint, strict TypeScript, 19 Vitest checks, production build, and 24 responsive public Playwright checks passed. The protected no-session route remains covered; the authenticated database transition is deliberately not claimed without a PostgreSQL-backed administrator.
- Limit: full category field editing and authenticated PostgreSQL acceptance remain outstanding.

## CP-16 — Category creation form correction

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: moved the category publication selector from the restaurant form to the category form, restoring the intended draft/published/archived category creation input.
- Verification: lint, strict TypeScript, 19 Vitest checks, production build, and 24 responsive public Playwright checks passed.

## CP-16 — Category lifecycle schema increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: added a versioned `MenuCategory.status` lifecycle field with draft default, updated illustrative seed categories to published, and exposed draft/published/archived selection in the guarded creation form.
- Verification: Prisma Client generated from the updated schema without a database connection; lint, strict TypeScript, 19 Vitest checks, and production build passed.
- Limit: applying the new migration and testing category publication changes against a real PostgreSQL database is delegated to CI; category edit/archive controls remain a subsequent admin slice.

## CP-04/21 — Remote repeat-seed verification

- Timestamp: 2026-10-15 (Asia/Karachi)
- GitHub Actions CI run #32 for commit `91f566a` completed successfully in 2m 56s. It provisioned PostgreSQL 16, applied the migration, ran the seed twice, and completed the expected 4 restaurant / 4 category / 48 menu-item / 48 nutrition-row assertion before the normal checks.
- This verifies idempotent illustrative seed behavior in the committed ephemeral PostgreSQL CI environment. It does not make the stopped local Docker database available or verify real restaurant data.

## CP-04/21 — Seed idempotency CI increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: CI now invokes the illustrative Prisma seed twice against its clean PostgreSQL 16 service and runs a count verifier that requires exactly four restaurants, four categories, 48 items, and 48 nutrition rows.
- Verification: workflow syntax and the standalone verifier's TypeScript compilation are checked locally; the new remote CI result is not claimed until GitHub Actions completes it.
- Limit: local execution remains blocked by the stopped Docker Desktop engine/no supplied PostgreSQL URL.

## CP-17 — Disclosure-input increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: extended guarded menu-item creation with validated ingredient/allergen disclosure entries and explicit `PRESENT`, `ABSENT_VERIFIED`, or `UNKNOWN` state. The admin form can add one explicit ingredient and one explicit allergen disclosure per item; server writes use normalized connect-or-create records and preserve the selected state.
- Verification: admin validation tests now reject unknown disclosure enums and accept explicit `UNKNOWN`; lint, strict TypeScript, 18 Vitest checks, production build, and 24 responsive public Playwright checks passed.
- Limit: the current form is intentionally a small creation slice rather than a multi-row disclosure editor. Persisted relation behavior and authenticated UI interaction remain unverified without PostgreSQL/admin credentials.

## CP-16/17 — Publication lifecycle increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: added server-authorized, origin-checked, rate-limited status routes for restaurant and menu-item publication state. The authenticated console now offers publish, unpublish, and confirmation-gated archive controls; each transition creates an audit record.
- Verification: lint, strict TypeScript, 16 Vitest checks, production build, and 24 responsive public Playwright checks passed. The new authenticated actions remain compile- and unit-boundary verified only because a real administrator/PostgreSQL server is unavailable.
- Limit: category lifecycle and full field-edit forms, ingredient/allergen administration, and database-backed authenticated acceptance tests remain outstanding.

## CP-23 — Clean-install final verification increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: performed a clean `npm ci` reinstall from the committed lockfile, then reran the complete local release sequence.
- Verification: `npm run lint`, `npm run typecheck`, `npm test` (8 files, 16 tests), `npm run build`, and `npm run test:e2e` (24 checks at 375px, 768px, and 1440px) all passed. Existing visual evidence was retained and protected-admin captures were reviewed.
- Limit: this is reproducible application verification, not a substitute for the still-unavailable live PostgreSQL/admin/deployment acceptance tests or institutional review.

## CP-22 — Deployment runbook increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: expanded the Vercel/managed-PostgreSQL release, monitoring, recovery, migration, and rollback instructions; added an HTTPS-only public smoke-check script for the health, robots, and sitemap endpoints.
- Verification: `node --check scripts/verify-public-url.mjs` passed. Its missing-URL and non-HTTPS rejection paths were exercised locally; no public target was supplied, so a successful deployed-URL smoke check is not claimed.
- Blocker: deployment requires a hosting account/project, managed PostgreSQL credentials, configured production environment variables, and a public HTTPS URL. No credentials or deployment action were available in this workspace.

## CP-20 — Admin mutation rate-limit increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: added a fixed-window in-process guard to all authenticated admin mutation routes. It allows 20 writes per administrator email per minute and returns a `429` response with `Retry-After` after the limit is reached.
- Verification: deterministic unit tests cover limit exhaustion and expiry; full lint, strict TypeScript, unit, production build, and public Playwright checks are run with this increment.
- Limit: in-process memory is intentionally a basic single-instance safeguard, not distributed production rate limiting. A managed shared rate-limit service remains required for horizontal scaling.

## CP-16/17/18 — Admin workflow visibility increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: completed the authenticated UI slice for the already guarded restaurant, category, and illustrative menu-item creation routes; added protected category/item read endpoints and a latest-20 audit feed. The browser test server now creates an ephemeral Auth.js signing secret so a no-session `/admin` route can be tested in production mode without committing a secret.
- Verification: lint, strict TypeScript, 14 Vitest checks, production build, and 24 Playwright checks (eight journeys across three viewports) passed. The public browser journey verifies an unauthenticated visitor sees the protected admin screen and sign-in link.
- Limit: the authenticated admin UI and writes could not be exercised because no test administrator/database is available. Edit, delete, full publication workflow, and persisted audit acceptance tests remain unverified.

## CP-23 — Report and source-register increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: added a clearly marked six-chapter technical-report draft and a source register separating checked public context sources from product data; reconciled the rubric and QA/test documents with existing CI and browser evidence.
- Verification: report statements were cross-checked against the implementation ledger, test suite scope, schema/routes, and public official WHO, USDA, and OWASP pages. `prettier` and `git diff --check` passed for the documentation change.
- Limit: the draft has no university metadata, human-subject/user-study results, supervisor review, faculty formatting approval, or production deployment result. It must not be submitted as final without those genuine inputs.

## CP-00 — Intake and baseline

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: repository/environment assessment, requirements and delivery governance. No legacy runtime files changed.
- Baseline: clean `main` branch; origin configured as `https://github.com/arafaymalik7/SmartPlate.git`.
- Environment: Node `v22.18.0`, npm `10.9.3`, Git `2.51.0`; pnpm and GitHub CLI are unavailable. No private university inputs exist under `docs/university/reference/`.
- Evidence: `git status --short --branch`, `git remote -v`, inventory, Node/npm/Git version checks executed before this change.
- Verification: documentation-only checkpoint; `git diff --check` passed. Focused secret-pattern scan found only legacy code paths that prompt for a password or name password fields; no values were staged. An unrelated pre-existing modification in `docs/REQUIREMENTS.md` was observed and deliberately left unstaged.
- Commit: `29974600cddcaa055b78b02dd4c4fcceb59c5223` (`docs(project): CP-00 intake and delivery governance`) on `codex/smartplate-complete`.
- Push: `GIT-PUSH-BLOCKED` — `git push -u origin codex/smartplate-complete` could not connect to the configured GitHub remote because the environment attempted `127.0.0.1:9`. No remote push is claimed.
- Blockers: database and cloud credentials not supplied; no GitHub CLI; outbound GitHub connectivity unavailable. These do not block CP-01 scaffolding.
- Next action: create Next.js TypeScript scaffold and tooling for CP-01.

## CP-01 — Scaffold and developer tooling

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: installed a strict TypeScript Next.js App Router scaffold, Tailwind/PostCSS baseline, lint/format/test tooling, documented environment variables and a `GET /api/health` route.
- Verification: `npm run lint` passed with zero warnings; `npm run typecheck` passed; `npm test` passed 1/1; `npm run build` passed and produced `/`, `/status`, and `/api/health`.
- Environment note: direct sandbox runs could not spawn the bundled compiler (`EPERM`); the same checks passed when run with the required unsandboxed process permission. npm’s first partial Windows install failed `ENOTEMPTY`; the recovery install finished with 486 packages and lockfile.
- Next action: record final CP-01 check output, stage only replacement-app files, commit and retry push.
- Commit: `71942e54f9847960ecefba20f2091e523be00de2` (`build(app): CP-01 scaffold Next.js tooling`).
- Push: `GIT-PUSH-BLOCKED` — retry failed against the configured remote with `Failed to connect to 127.0.0.1 port 9`.
- Next action: establish CP-02 visual system, shared navigation and system states.

## CP-02 — Design system and navigation

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: added shared header/footer shell, responsive forest/cream token system, skip link and focus treatment, public landing baseline, and loading/error/not-found states.
- Verification: `npm run lint`, `npm run typecheck`, `npm test` (1/1), and `npm run build` passed. Browser/Playwright screenshot verification is UNVERIFIED because no browser automation tool is available in this runtime; it remains required at CP-05 and CP-19.
- Next action: commit CP-02 then implement PostgreSQL/Prisma schema and migration setup.

## CP-03 — PostgreSQL and Prisma schema

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: added Prisma 7 PostgreSQL configuration, driver-adapter client singleton, environment validation, schema models for menu/provenance/disclosure/audit data, and database operation notes.
- Verification: `npm run db:generate` passed with Prisma Client 7.10.0; strict TypeScript passed.
- Blocker: `DATABASE_URL`/`DIRECT_URL` point to no supplied local PostgreSQL server. `db:migrate` and relational runtime tests are UNVERIFIED; no migration was attempted against an unknown database.
- Next action: commit CP-03, then add the idempotent illustrative seed after a local PostgreSQL instance is available.

## CP-04 — Demo dataset

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: added an idempotent Prisma seed blueprint for four fictional restaurants and 48 illustrative dishes, plus typed demonstration records for UI/testing.
- Verification: strict typecheck passed; Vitest passed 2/2 and checks illustrative source labels plus an intentionally unknown calorie value.
- Blocker: seed execution against PostgreSQL is UNVERIFIED pending an approved database URL.
- Next action: public restaurant discovery routes.

## CP-11/12 — Recommendation engine

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: pure deterministic eligibility/ranking module with explicit unknown-allergen handling, grounded explanations, missing-data limitations and stable tie breaking.
- Verification: lint and strict TypeScript passed; Vitest passed 5/5; production build passed.
- Next action: build preference/results UI over this engine.

## CP-19/21/22 — Quality, CI and deployment preparation

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: added public information routes, GitHub Actions lint/typecheck/test/build workflow, security posture and deployment runbook.
- Verification: lint, typecheck, 5/5 unit tests and production build passed.
- Unverified: browser accessibility/screenshots, cloud CI result and Vercel/managed PostgreSQL deployment require browser/cloud credentials not available in this runtime.

## CP-15 — Authentication and admin access

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: added Auth.js/NextAuth credentials flow, hashed password bootstrap command, sign-in UI and dynamic admin route with server session check.
- Verification: lint, strict TypeScript, 7/7 tests and production build passed. Build verifies `/admin` and `/api/auth/[...nextauth]` route compilation.
- Unverified: actual administrator bootstrap/login/logout/unauthorized mutation tests require PostgreSQL and configured `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, and strong bootstrap credentials.

## CP-16/17/18 — Admin server guards and validation

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: server-side admin session guard, restaurant API with validated mutation path, truthful summary endpoint and Zod validation for restaurant/menu input.
- Verification: lint, strict typecheck, 9/9 unit tests and production build passed.
- Unverified: direct authenticated CRUD, relational integrity, audit persistence and admin UI require PostgreSQL and a bootstrapped admin.

## CP-23 — Final evidence reconciliation (partial)

- Timestamp: 2026-10-15 (Asia/Karachi)
- Local release checks: lint, strict TypeScript, 9/9 Vitest tests and production build passed at commit `41b234950d27ceb1e0ccc0903a5dc2c2ad2e3bd2`, pushed to `codex/smartplate-complete`.
- Release status: FUNCTIONAL BUT PARTIALLY UNVERIFIED. PostgreSQL integration, browser E2E/accessibility captures, real admin journey, GitHub Actions result, deployment, user testing and university approval remain outstanding.

## Local PostgreSQL attempt

- Docker CLI and Compose are installed, but `docker compose up -d db` failed because `//./pipe/dockerDesktopLinuxEngine` does not exist: Docker Desktop's Linux engine is not running.
- `psql` is not installed. Migration, seed and authenticated DB tests remain blocked by this environment state.
- A normal `Start-Service com.docker.service` attempt was denied by Windows (`Cannot open com.docker.service service on computer '.'`); starting Docker Desktop's Linux containers engine requires the desktop user's permission/elevation.

## CP-19 â€” Responsive browser verification

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: configured Playwright to use an installed local Chromium when its standard headless-shell bundle is absent; browser tests run against a production build, cover 375px, 768px and 1440px viewports, and save reviewed public discovery captures under `docs/evidence/`.
- Verification: `npm run test:e2e` passed 6/6. The restaurant-discovery captures at all three viewports were visually reviewed; navigation, restaurant content, transparent demo disclosure, links and footer are visible without overlap.
- Remaining limits: these browser checks use typed illustrative in-memory data. Database-backed menus, authentication and admin journeys remain unverified until Docker Desktop's Linux engine is started or usable PostgreSQL `DATABASE_URL` and `DIRECT_URL` values are supplied.

## CP-03/10/13/16/18/21 â€” Reconciliation increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: added a versioned PostgreSQL baseline migration, a strict preference flow with non-persisted allergy-related exclusions, a Playwright safety journey, a protected admin restaurant form, transactional admin audit creation, and a PostgreSQL-backed CI workflow definition.
- Verification: `npm run lint`, `npm run typecheck` and `npm test` passed (10 unit tests); `npm run test:e2e` passed (9 checks across 375px, 768px and 1440px). The preference capture at `docs/evidence/mobile-375-recommendations.png` was visually reviewed.
- Unverified: `db:deploy`, seed idempotency, CI execution, authenticated admin mutation, and live PostgreSQL relations require Docker Desktop's Linux engine or a disposable PostgreSQL URL. The workflow is configured to execute migration, seed, lint, typecheck, unit, production build and browser checks when GitHub Actions runs.

## CP-06 â€” Bounded directory interaction

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: added an accessible name/cuisine/location search and location filter to the transparent illustrative restaurant directory, including a resettable no-results state.
- Verification: lint, strict typecheck and 10 unit tests passed; production Playwright passed 12/12 across 375px, 768px and 1440px. The updated desktop restaurant directory capture was visually reviewed.
- Limit: the interactive fallback directory is typed illustrative data. Its PostgreSQL query path, pagination and published-status enforcement still require a running test database.

## CP-07/08/09 â€” Menu browsing and disclosure increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: expanded the illustrative public menu to 48 records (four venues, 12 dishes each), added category/search/sort/verified-diet filters and no-results reset handling, and completed item pages with serving size, nutrition values, ingredients, disclosure state, source classification and review date.
- Verification: production Playwright passed 15/15 at 375px, 768px and 1440px; the mobile filter capture at `docs/evidence/mobile-375-menu-filters.png` was visually reviewed. A unit check verifies the four-menu/48-item shape and preservation of null nutrition values.
- Limit: public runtime reads still use the explicitly labelled typed demonstration fallback. The equivalent PostgreSQL relation/query path and published/draft integration require the blocked database environment.

## CP-16/17/18 â€” Admin mutation and audit increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: added server-authorized category and menu-item creation routes, nutrition/provenance validation, category-to-restaurant ownership checks, transactional audit-log writes, and audit-event counts in the protected summary response.
- Verification: lint and strict TypeScript passed; 12 Vitest checks passed, including invalid URL/category-slug and negative-price validation. The protected routes compile in the production build.
- Unverified: authenticated creation/edit/unpublish/delete, relational persistence, audit rows and public published-state impact require the blocked disposable PostgreSQL environment.

## CP-20 â€” Mutation-origin hardening increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: added explicit same-origin checks to every current admin mutation endpoint before authorization/database access, with trusted/cross-origin/malformed-origin unit cases.
- Verification: lint, strict TypeScript and production build passed; Vitest passed 14/14 including two origin-guard tests.
- Remaining security work: database-backed authenticated mutation/CSRF/logout checks and production-appropriate rate limiting require a running test database and deployment context.

## CP-19 â€” Keyboard navigation increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: added Playwright keyboard coverage for the primary skip link, confirming focus arrives on it first and keyboard activation bypasses repeated navigation to `#content`.
- Verification: production Playwright passed 18/18 across 375px, 768px and 1440px. Existing responsive menu and recommendation captures remain reviewed.
- Remaining a11y work: no automated screen-reader audit or authenticated admin keyboard journey is claimed; the latter requires PostgreSQL-backed authentication.

## CP-23 â€” Academic evidence draft increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: added implementation-derived Mermaid source diagrams for runtime architecture, ERD, recommendation flow and admin mutation sequence, plus an accurate ten-slide defense outline and demo script.
- Verification: diagrams were checked against the current schema, route handlers and recommendation engine. They remain Markdown source diagrams; no faculty approval, user-study result or rendered report figure is claimed.

## CP-19 â€” Public crawl metadata increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: added Next.js metadata, robots and sitemap routes; public pages may be indexed while `/admin` and `/api/` are excluded in the generated robots policy.
- Verification: lint/typecheck/unit checks passed and production Playwright passed 21/21, including direct `robots.txt` and `sitemap.xml` assertions at 375px, 768px and 1440px test projects.
- Deployment note: `NEXT_PUBLIC_APP_URL` must be set to the actual public HTTPS origin before deployment so generated sitemap URLs do not use the local fallback.

## CP-14 â€” Interactive comparison increment

- Timestamp: 2026-10-15 (Asia/Karachi)
- Scope: replaced the fixed comparison with a bounded two-to-three dish selector, with per-serving metric table, null handling and mobile horizontal-scroll guidance.
- Verification: production Playwright passed 21/21 and exercises selection of a different dish. The mobile comparison capture at `docs/evidence/mobile-375-comparison.png` was visually reviewed and the initially cramped table was corrected.
- Limit: comparison currently uses labelled illustrative fallback data; persistence/bookmarking and database-backed options await the PostgreSQL environment.

## CP-21 â€” Remote CI database evidence

- Timestamp: 2026-10-15 (Asia/Karachi)
- GitHub Actions CI run #20 for commit `50981b4` is confirmed successful from the public workflow feed (duration 2m 05s). Its workflow provisions PostgreSQL 16, runs migration deployment and seed, then lint, strict typecheck, unit tests, production build, Chromium installation and Playwright.
- This verifies the committed migration/seed workflow against an ephemeral CI PostgreSQL service. It does not verify the unavailable local Docker environment, production deployment, or real administrator credentials.
