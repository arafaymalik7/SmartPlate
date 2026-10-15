# CODEX MASTER INSTRUCTION — BUILD SMARTPLATE TO COMPLETION

**Copy this entire instruction into Codex with the SMARTPLATE repository open.** This is ONE continuous multi-stage execution request. Do not stop after making a plan or scaffold. Implement, test, document, commit, and push progressively until the release gate is reached or a genuine external blocker prevents progress.

## 0. Mission, source-of-truth, and non-negotiables

Act as an autonomous senior full-stack engineer, UI/UX designer, software test engineer, DevOps engineer, and technical documentation lead. Build a **new, complete, professionally designed, deployment-ready SMARTPLATE web application** from the approved minor-project proposal:

**SMARTPLATE: A Web-Based Intelligent System for Analyzing Restaurant Menus and Providing Personalized Nutrition and Health-Aware Meal Recommendations.**

The deliverable is an actual fully functioning **Next.js + PostgreSQL** application, **not** the earlier FastAPI/SQLite implementation, a static HTML template, a screenshot, a frontend-only mockup, an incomplete scaffold, or pseudocode. Implement the entire approved functionality, validate it at fine-grained milestones, and push verified progress to GitHub after EVERY checkpoint. Aim for excellent design and robust engineering while keeping the feature scope realistically defensible as a university minor project.

**Submission deadline:** 15 November 2026. **Internal feature/report freeze:** 12 November 2026. Prioritize core correctness, actual evidence, and a stable build above optional features. The user has authorized normal incremental git commits and pushes to the configured repository for this project. Do not force-push, overwrite unrelated work, create destructive migrations, or publish credentials. If no remote is configured, set up a repository using an authenticated GitHub CLI if available, or request the repo URL/auth access as the one required unblocker; continue independent local work and queue commits while awaiting it. Do not falsely report pushes.

**Authoritative university materials, if present in workspace:**
- `docs/university/reference/proposal.jpg` — approved proposal defense form (or similarly named image).
- `docs/university/reference/report-guidelines.pdf` — UNITAR BIT report writing and formatting guideline.
- `docs/university/reference/minor-project-rubric.xlsx` — ITWB2914 minor project assessment rubric.

Read and extract these sources BEFORE finalizing academic requirements. **These source files may contain private student identifiers. Treat `docs/university/reference/` as LOCAL-ONLY private input, explicitly add that directory to `.gitignore` before the first commit, and NEVER push these originals to GitHub unless the user explicitly authorizes publication.** Cite or summarize the non-sensitive requirements in tracked documentation instead. If any source is missing, use the requirements transcribed below, record the missing source, ask for it only if it would block correct work, and continue. Preserve the exact approved project title. Do not automatically treat contradictory examples as authoritative; the sample report cover in the older guide has an inconsistent course-code label, so flag it for supervisor confirmation.

### Approved scope and intended users
- General customers seeking more informed food choices.
- Health-conscious people interested in tracking nutrition.
- Restaurant owners/staff digitizing and managing menus.
- Students and working professionals making quicker meal decisions.
- The system must digitally display restaurant menus, analyze nutritional values, and give personalized, **explainable rule-based** meal recommendations considering dietary goals, preferences, exclusions and informational health-related nutrition priorities.

### Absolute integrity and safety requirements
1. No hallucinated restaurant-specific nutritional facts, medical claims, allergen safety assurances, real user evaluation, bibliography, supervisor meetings, GitHub pushes, test passes, browser screenshots, or deployment statuses.
2. Demo restaurants may be fictional, and demonstration nutrition values may be illustrative, **but clearly label them as fictional/illustrative across UI, API, seed, report, and demo**, including a per-item source classification. Never label synthetic values as verified.
3. Model missing nutrient values as `null`/unknown—not zero. Respect serving size and units. Do not infer that a food is allergen-free from missing data; unknown allergy/ingredient status must never be shown as safely compatible.
4. Do not solicit or store diagnoses, medical history, or sensitive health profiles. Nutrition priorities are informational, not medical prescriptions. Include clear and unobtrusive disclaimers.
5. Do not invent external sources. Provide actual traceable source metadata for non-illustrative nutrient records and obey source attribution/licensing. Start with reliable illustrative data if external access is blocked.
6. Never hardcode secrets, tokens, admin passwords, DATABASE_URL, cookies, access keys, or private URLs. Never print secrets to console or commit them to git. Use `.env.example` with placeholders; real `.env*` secret files must be ignored.
7. Do not say “complete”, “tested”, “deployed”, or “pushed” unless verification output demonstrates it. Record honestly what still needs human action.
8. No workaround intended to disguise AI-generated work or fabricate originality; academic work must be reviewed and defended by the student and comply with faculty AI-use rules.

## 1. Required technical stack

Use:
- **Next.js** (current stable compatible release, App Router) + React + TypeScript in strict mode.
- **Tailwind CSS** + **shadcn/ui** + Radix-based accessible primitives; coherent original styling, not stock boilerplate.
- **PostgreSQL**, with **Prisma ORM**, version-appropriate Prisma Client/driver adapter, reproducible versioned migrations, and idempotent seeding.
- **Zod** for input validation; server-side authorization and business logic.
- **Vitest** + Testing Library where useful for pure logic/components; **Playwright** for full browser journeys.
- **ESLint**, Prettier, type checking, strict CI, GitHub Actions.
- **A maintained auth system** compatible with the chosen versions (prefer Better Auth or Auth.js with a supported Prisma adapter) for the protected administration area. Select ONE, implement it correctly with server-validated sessions and a safe admin bootstrap. Do not roll your own crypto/session protocol.
- **Vercel + managed PostgreSQL (Neon or equivalent)** as the preferred deploy target, with clear local PostgreSQL/Docker alternative. Do not require paid services for development.

Avoid unstable/pre-release dependency combinations. Specifically verify the exact current Prisma release and compatible authentication adapter in official documentation BEFORE installing, instead of blindly combining the newest incompatible major versions. Pin compatible versions in the lockfile, justify key decisions in `docs/decision-log.md`, and follow version-appropriate configuration. Use one package manager consistently (default `pnpm` if available; otherwise npm). Node.js requirements must match the selected stack.

**Do not replace Next.js with FastAPI, Express, Laravel, Flask or static HTML, and do not replace PostgreSQL with SQLite, Supabase-only client state or JSON files.** PostgreSQL is the authoritative persistent database. Neon is a PostgreSQL hosting choice, not a replacement for Prisma migrations.

## 2. First actions: repository assessment, setup and execution governance

At the beginning:
1. Identify current working directory. Run `pwd`, inspect files, `git status`, `git remote -v`, branch information, installed Node/package manager, environment availability (without showing secret values), and whether internet/database/browser tools are usable.
2. If an existing repository contains a previous implementation, inspect it without deleting work. This project should be built in Next.js/Postgres; migrate only valid requirements/assets that have verified provenance. Do not merge incompatible FastAPI/SQLite runtime code.
3. Read the proposal/guideline/rubric if mounted. Derive a `docs/requirements.md`, `docs/rubric-mapping.md`, and `docs/plan.md`, but begin coding immediately after the short plan.
4. If the working directory has unrelated uncommitted changes, STOP changing those files and ask for the safest branch/worktree decision. Never stash, reset, or discard user work without permission.
5. Configure the `origin` GitHub remote if one already exists; otherwise create a new `smartplate` repo via authenticated GitHub CLI if authorized and possible. If neither is possible, make local atomic commits and mark push BLOCKED rather than pretending success.
6. Prefer dedicated branch `codex/smartplate-complete` if working in an existing shared repo; if the repo is completely new and empty, initialize a safe default branch and publish it. **Push after every checkpoint.** Do not automatically merge into a protected `main`; at final completion open a pull request where supported. If direct commits on `main` are already the established sole-user project workflow and the branch is clean, you may push there.
7. Create `AGENTS.md` summarizing project scope, stack, formatting, test commands, security, nutrition, evidence integrity, and commit/checkpoint protocol so subsequent Codex sessions follow the same rules.
8. Keep a truthful, restartable execution ledger in `docs/implementation-progress.md`, and update `docs/test-results.md`, `docs/decision-log.md`, and `docs/rubric-mapping.md` incrementally. If a Codex session/context window ends, checkpoint all work, write the exact next checkpoint and blockers in the ledger, and resume from there on the next session. Never silently restart or redo completed work.

### Continuous-operation instruction
This is an instruction to **execute ALL checkpoints**, not merely enumerate them. Do not ask permission between routine checkpoints; continue automatically after the gate passes. Ask the user only for unavoidable external prerequisites, such as GitHub authorization/repo ownership, real DATABASE_URL, deployment credentials, or a conflicting existing repository. When credentials are missing, use local or containerized PostgreSQL where available, and continue code/tests/docs; explicitly mark cloud-dependent steps BLOCKED. Never claim to have verified external integrations without access.

## 3. Quality gate and required commit/push workflow — AFTER EVERY CHECKPOINT

For each checkpoint CP-00 through CP-23 below, perform this sequence:

1. Describe in 2–5 sentences which small feature is being implemented and which routes/files are affected.
2. Implement the smallest complete vertical change; do not mix unrelated fixes or postpone tests until the very end.
3. Add or update relevant unit, integration, or browser test(s) **in that checkpoint**. Ensure new behavior has a clear acceptance criterion. Exercise negative/empty/error states as well as happy paths.
4. Run the checkpoint's targeted checks. Also run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` where applicable to the established scaffold. Run Prisma migration/seed checks when schema changes. At checkpoints involving UI, run Playwright and inspect screenshot output at mobile ~375px, tablet ~768px, and desktop ~1440px. Capture actual screenshots from the browser; do not fabricate images.
5. Fix all issues found and rerun checks. Do not suppress types, disable lint rules wholesale, skip critical tests, or turn off security checks to achieve a green result.
6. Check git status/diff; ensure generated artifacts, private university inputs, screenshots containing identifiers, and private `.env` files are not staged. Run a secret-pattern scan and check for accidentally committed personal data. Stage ONLY intended files. Never use unrestricted `git add -A` before reviewing ignored/untracked files.
7. Update `docs/implementation-progress.md` with timestamp, checkpoint ID, real tests/commands and results, screenshots/evidence locations, blockers, and a concise next action.
8. Make **one or more small, meaningful commits**, e.g. `feat(menu): CP-06 add restaurant menu detail`, using conventional commit syntax. Then **push to the configured origin for that branch**. Capture the commit SHA, branch, and push result. A checkpoint is PASSED only if implementation + tests + commit + push have been verified. If the push fails for a network/auth reason, mark GIT-PUSH-BLOCKED and retain the local commit, retry safely later before calling remote delivery complete.
9. After a checkpoint, report a compact checkpoint log: feature done; tests pass/fail; visual status; commit SHA; push branch/status; blockers. Continue automatically to the next checkpoint, without waiting for confirmation if unblocked.
10. If a critical test cannot be executed due to environment limitations, mark the check **UNVERIFIED**, implement an honest fallback/manual check list, and do not claim a full pass. Do not replace actual Playwright with mocked browser assertions and call it E2E verified.

Use CI on PR/push: lint, strict TypeScript, unit tests, test database migrations, integration tests, production build, Playwright smoke, and secret scanning where feasible. Configure GitHub Actions PostgreSQL service or equivalent for repeatable tests. Keep tests deterministic and independent; reset test DB between tests. Never run destructive tests on production databases. CI failing after push requires an immediate fix checkpoint before continuing.

## 4. Design brief — excellent but usable visual quality

Create a polished, distinctive web app that feels like a modern nutrition/dining SaaS product, not a generic dashboard template.

**Visual direction:** contemporary, clean, warm, friendly and professional; restrained color system (deep forest green / sage or muted teal; cream/off-white surfaces; limited coral or amber highlights); readable neutral text; generous whitespace; clear hierarchy; elegant typography; premium but subtle cards/shadows; tasteful food photography *only where usage rights and relevance are known*, otherwise attractive original SVG/gradient illustrations and fallback art. No copyright-infringing assets. Avoid clutter, glassmorphism overload, generic mismatched icon packs or excessive animations.

**Design system:** documented spacing, color, typography, radii, surface and states tokens; responsive layout; consistently styled form inputs, cards, badges, buttons, tables, navigation, dialogs, toasts and charts. Reuse component patterns instead of copying huge pages. Support light mode; dark mode optional only after everything required works. Use meaningful skeletons and good empty/error states. Build the navigation and footer intentionally.

**Accessibility:** semantic HTML, good focus rings, proper labels, keyboard navigation, contrast meeting WCAG AA where feasible, descriptive alt text, proper dialog focus management, understandable validation errors, reduced motion support. No important information conveyed only by color. Test common flows without a mouse.

**Visual QA:** after each UI checkpoint inspect screenshots at 375, 768 and 1440px and fix overflow, misaligned cards, illegible labels, touch-target failures, missing images, clipping and inconsistent spacing. Compare screenshots after style changes for regression. Never claim visual inspection if the browser could not launch.

## 5. Functional specification and acceptance requirements

### A. Public site
- Home page with SMARTPLATE brand, value proposition, how it works, sample highlights, call to action, trust/limitations explanation.
- Restaurant directory with paginated or appropriately bounded searchable restaurant cards; name/cuisine/location demo metadata, open/published status, image/fallback.
- Individual restaurant profile with categories, searchable menu list, filters/sorting, item counts and no-results states.
- Menu item details: item name, description, price with currency explicitly chosen/configured, category, serving size, nutrition panel (kcal, protein, carbohydrates, fat, sodium; optionally sugar and fiber), ingredient list, allergen/uncertainty status, source citation/classification, last-reviewed date, and clearly rendered `Not available` for missing values.
- Menu comparison of 2–3 dishes with a side-by-side nutrition table, per-serving units, missing-value handling, and clear differences.
- Informational pages: About, How recommendations work, Methodology/Data sources, Disclaimer/Privacy, Help/FAQ and appropriate not-found/error handling.

### B. Preferences
- User can set meal calorie target or range, diet (no preference / vegetarian / vegan when verifiable), optional higher-protein / lower-sodium / lower-carb priorities, excluded ingredients, and allergy-related exclusions with explicit uncertainty warnings.
- Preference form uses Zod validation, accessible helper messages, clear defaults and reset capability.
- Guest preferences can be persisted in browser local storage **only for non-sensitive preference controls**, with a clear explanation and easy clearing. Avoid diagnoses and personally identifiable health data. Admin is separate.

### C. Rule-based recommendation engine — a real tested algorithm
- Build a **pure, deterministic TypeScript recommendation module** separated from route rendering, with exported typed input/output and documented constants/weights. No need to use a third-party LLM or falsely market the algorithm as trained AI.
- **Hard eligibility rules:** inactive item excluded; when vegetarian/vegan is selected, exclude known incompatible items, classify unknown ingredient/verification status as UNKNOWN rather than automatically safe; known explicitly excluded ingredients/allergens excluded. If a strict allergy preference cannot be safely evaluated due to missing disclosure, do not label the item eligible/safe—either exclude from safe matches or put it into a separate `Unable to verify` group with a warning and no reassuring safe badge.
- **Soft ranking:** e.g. calorie fit 40%, selected nutritional priority 30%, completeness/provenance 20%, other preference fit 10%; these are **software design parameters, not evidence-based clinical weights**. Choose sensible normalized methods and document exactly how each is computed. Never treat missing nutrient values as zero or award a bogus high score; use partial-score logic with penalties/insufficient-data handling.
- Return numeric score plus 1–3 explanations actually grounded in the item's data (e.g. closest calorie target, known protein/sodium number), limitations and provenance. Sort deterministically with stable tie-breaking.
- Handle no eligible results; provide suggested filter adjustments without automatically overriding strict exclusions.
- Show a clearly differentiated personalization wizard and result views; enable filter adjustment and comparative nutrition.
- Provide automated tests for all hard exclusions, unknown allergy state, conflicting filters, target-calorie ties, missing data, extreme inputs, deterministic ordering, selected priority sensitivity, and zero-results conditions.

### D. Administration
- Protected `/admin` area with maintained auth integration and role-based access checks enforced **server side** on every mutation/read requiring authorization. Unauthorized direct API/action calls must fail.
- Secure admin bootstrap process: CLI/env-based setup, one-time initiation, strong secret credentials stored as hashes if a password strategy is used; no default public credentials, no unauthenticated admin sign-up. Avoid hardcoded email/password.
- Dashboard: total restaurants, menu items, published/draft counts and data-completeness indicators (basic truthful aggregates).
- Create/edit/unpublish/delete restaurants, categories and menu items; prefer archive/soft-delete or confirmation for destructive operations.
- Validated forms for nutrition values/units, serving size, price, allergens, ingredient disclosures, data source type and URLs. Server rejects negative numbers, invalid enums, cross-restaurant category references and unauthorized mutations.
- Show validation errors and success states. Simple audit trail (actor, action, entity, time) on admin edits where feasible. Seed bootstrap admin deliberately and securely, not via fake placeholders.

### E. Seed data and nutrition provenance
- Seed **4 clearly fictional demo restaurants, ~40–60 clearly illustrative menu items** across categories, with diverse diet types and sample nutrition values (some missing values intentionally). Initial dataset is ONLY demonstrative, not verified real-restaurant nutrition. Include comments and UI banner describing this.
- All meal records have consistent quantities and `sourceType` enum: `ILLUSTRATIVE`, `FOOD_COMPOSITION_DERIVED`, `RESTAURANT_VERIFIED` with source URL/citation and reviewed date. Never mark generated demo data verified.
- Use nullable nutrient decimals, measured/declared serving-size units, unit labels and provenance. Model normalized ingredients and allergen status with explicit `PRESENT`, `ABSENT_VERIFIED` (only with evidence), `UNKNOWN` or similar meaningful states; absence of a join record DOES NOT imply safe absence. Also model draft/published status.
- Idempotent seeding; repeatable fresh install; realistic variable nutrition profiles to demonstrate recommendation behavior. Source metadata should be visible in item detail and admin editor.

## 6. Data and architecture constraints

Propose and implement an actual ERD-derived Prisma schema. Recommended entities (adapt only for good reasons):
- `User`, `Session`, `Account` or auth-library-generated models and role assignment (at least ADMIN role).
- `Restaurant`, `MenuCategory`, `MenuItem`.
- `Ingredient`, `MenuItemIngredient` with verification/state; `Allergen`, `MenuItemAllergen` with explicit known/unknown verification semantics.
- `MenuItemNutrition` or typed nullable nutrient columns with `NutritionSource` metadata.
- `AdminAuditLog` for traceable updates.

Use UUID/cuid as appropriate, unique slugs, indexes for slug/filter/lookups, referential integrity and unambiguous deletion behavior. Currency and money use safe decimal representation, never imprecise float for financial calculations. Nutritional data uses `Decimal` or well-defined numeric types with consistent conversion; never render a missing value as zero. Use migrations committed to git; never reset/drop a populated non-test database to silence an error. Separate runtime pooled connection from direct migration URL where appropriate.

Prefer server components for reads, client components for necessary stateful interaction, server actions/route handlers for mutations with authentication and Zod validation. Use clean service layers (`lib/recommendations`, `lib/nutrition`, `lib/db`, `lib/auth`) and avoid giant god files. Avoid raw SQL; if unavoidable use fully parameterized queries. Avoid client-embedded DB URLs, exposed secrets or bypasses.

Suggested project tree (adapt to actual Next.js conventions and selected tools):

```text
smartplate/
  src/app/(public)/...
  src/app/admin/...
  src/app/api/...
  src/components/ui/...
  src/components/restaurant/...
  src/components/menu/...
  src/components/recommendation/...
  src/lib/auth/...
  src/lib/db/...
  src/lib/nutrition/...
  src/lib/recommendation/...
  src/lib/validation/...
  prisma/schema.prisma
  prisma/migrations/...
  prisma/seed.ts
  tests/unit/...
  tests/integration/...
  tests/e2e/...
  docs/university/reference/...
  docs/evidence/...
  docs/report/...
  docs/implementation-progress.md
  docs/rubric-mapping.md
  docs/decision-log.md
  docs/supervisor-log.md
  .github/workflows/ci.yml
  AGENTS.md
  README.md
  .env.example
```

## 7. Execution checkpoints — DO ALL OF THEM, IN ORDER; COMMIT + PUSH EACH

Every checkpoint has a narrow vertical slice, acceptance gate, tests, docs and verified GitHub push. For an existing repository, adapt safely but never skip a requirement silently.

**CP-00 — Intake and baseline.** Inspect project/git/environment, read university source materials, capture existing-file inventory and nonsecret prerequisites; add `docs/plan.md`, `docs/requirements.md`, `docs/rubric-mapping.md`, `AGENTS.md`, `docs/implementation-progress.md`; verify references, status and no destructive edits; commit/push docs bootstrap.

**CP-01 — Scaffold and developer tooling.** Create Next.js App Router, TypeScript strict, Tailwind, lint/formatter, package scripts, `.gitignore`, `.env.example`, README, `src` structure, health/status check where suitable; test lint/typecheck/build; commit/push.

**CP-02 — Design system and navigation.** Set design tokens, typography, responsive nav/header/footer, button/card/form standards, themed placeholders, shared errors/loading/404. Inspect three viewport sizes; verify keyboard navigation; commit/push.

**CP-03 — Database and migrations.** Implement PostgreSQL + Prisma schema (with auth compatibility review), client singleton and environment validation, versioned migration, migration deployment instructions; test connection, foreign keys, relations and invalid input constraints where feasible; commit/push.

**CP-04 — Demo dataset.** Build idempotent realistic fictional seed for ~40–60 dishes/4 restaurants, some missing nutrition/allergen metadata intentionally, verify repeated seeding doesn't duplicate records and source labels remain ILLUSTRATIVE; commit/push.

**CP-05 — Landing page.** Build complete brand landing: hero, feature overview, how it works, representative demo restaurants/dishes, CTA, limitations summary, polished responsive imagery/illustrations. Real route/navigation and Playwright visual QA; commit/push.

**CP-06 — Restaurant listing.** DB-backed directory with search, filters/pagination or bounded listing, loading/error/empty state, responsive cards. Test actual SQL-backed data path and UI; commit/push.

**CP-07 — Restaurant page and categorized menu.** Published restaurant route by slug, categorized dishes, item cards, navigation, not-found handling, visibility handling. Test real DB behavior and mobile UI; commit/push.

**CP-08 — Menu item nutrition details.** Build complete nutrition panel, per-serving units, provenance, ingredient/allergen uncertainty, images/fallback, no-data state, dietary tags only when verifiable. Test absent nutrient not displayed as zero; commit/push.

**CP-09 — Menu search and detailed filters.** Add interactive category/search/sort/dietary filters with accessible controls, query/URL state when useful and truthful no-results. Test invalid query, combined filters and accessibility; commit/push.

**CP-10 — Preference wizard.** Build clear goal/diet/exclusion preference flow, client persistence only for non-sensitive controls, reset and validation; test keyboard, Zod and conflicting selections; commit/push.

**CP-11 — Recommendation eligibility engine.** Implement pure TS hard exclusion and safe unknown-handling logic. Unit tests for every restriction/unknown case; server input validation; commit/push.

**CP-12 — Recommendation ranking and explanations.** Implement normalized scoring, deterministic tie-break, missing-data penalties/insufficient context, evidence-based generated reasons, honest empty states; numerical boundary/property-style tests; commit/push.

**CP-13 — Recommendations UI.** Integrate engine with preferences and real PostgreSQL data, ranked recommendations, explanation cards, source caveats, filter changes, empty states and skeletons. Test a full Playwright journey; commit/push.

**CP-14 — Meal comparison.** Build 2–3 item comparison with per-serving side-by-side metrics and missing-nutrient handling; UI tests; screenshot inspection; commit/push.

**CP-15 — Authentication and admin access.** Implement supported auth library, secure admin bootstrap, session cookies, server route/mutation guards, sign-in/out, rate limiting if practical. Test invalid credentials, unauthorized mutations, escalation resistance and logout; commit/push.

**CP-16 — Restaurant/category administration.** Implement admin CRUD + draft/published visibility, validation and confirmation states. Test direct server authorization, relational integrity and editable UI; commit/push.

**CP-17 — Menu/nutrition/ingredient administration.** Complete admin item management with nutrition units, source metadata, ingredient/allergen status, edit history and error handling. Test negative values, cross-restaurant references, bad URLs, and published impact; commit/push.

**CP-18 — Admin summary and audit trail.** Implement counts/completeness overview, simple audit records, missing-data discovery; test truthful computed metrics; commit/push.

**CP-19 — UX, a11y, responsiveness and performance audit.** Perform manual/automated accessibility checks, real Playwright snapshots at mobile/tablet/desktop, broken image/link checks, keyboard navigation, web-vitals/core speed optimization, loading states, metadata/favicon, SEO indexability of public pages. Fix defects; commit/push.

**CP-20 — Security and robustness audit.** Check auth, CSRF strategy, input validation, rate limits, secret leakage, XSS/SQL injection pathways, safe error messages, data protection, unsafe file uploads (do not add upload unless needed), privacy notice and logs. Write and run negative tests; commit/push.

**CP-21 — Complete automated testing + CI.** Expand tests to cover critical flows, create reproducible test PostgreSQL setup and GitHub Actions checks, verify migration/seed from clean DB, typecheck, lint, unit+integration+E2E, build. Verify CI status from GitHub if accessible; commit/push.

**CP-22 — Deployment and operational runbook.** Create Vercel-compatible deployment setup, PostgreSQL deployment env instructions, safe migration deploy, schema health checks, basic error monitoring/logging and rollback/recovery documentation. If authenticated to cloud, deploy and smoke-test *actual public URL*; otherwise mark DEPLOYMENT REQUIRES HUMAN CREDENTIALS, fully document exact steps, and never claim deployed. Commit/push.

**CP-23 — Final academic/release package.** Reconcile every proposal and rubric requirement against actual functionality; update report support docs/diagrams, screenshots/evidence, user test protocol, defense outline, FAQs, final README/setup instructions, final QA checklist, known limitations, source provenance and `RELEASE_NOTES.md`. Run **all** checks from a clean install or reproducible CI and confirm git remote pushed. Tag `v1.0.0` ONLY if stable, tested and remotely pushed. Where supported create GitHub PR with verified release summary; do not merge to protected branch automatically. Commit/push/tag safely; end with an evidence-based final report.

**Important:** The stages are a default checklist; feel free to split checkpoints even smaller, with additional commits/pushes, if implementation warrants it. Do not merge many checkpoints into one untested mega-commit. Avoid adding optional features until all required gates pass. Revisit previous tests after integration failures; prioritize recovery over new work.

## 8. Precise acceptance tests and failure cases

At minimum, automate or manually verify with real environments and record results:

1. Fresh clone + install + configure `.env` + Postgres migration + seed + startup works.
2. Seeding twice does not double records; migration from empty schema succeeds.
3. Homepage, listing, restaurant page, item page, preference flow, results, comparison and admin routes render properly on phone and desktop.
4. Unpublished restaurants/items never appear in public listing or direct detail routes.
5. Search and category filters are accurate and empty results informative.
6. Calorie/macros/sodium use correct labels; unknown is shown as N/A, never zero.
7. Demo values are explicitly illustrative wherever shown or exported.
8. Vegetarian/vegan known-incompatible item excluded; unknown dietary status not mislabelled.
9. Known excluded ingredient/allergen filtered; missing allergen information never passed as safe.
10. Different goal/priorities can change ranking; repeated identical inputs produce deterministic output.
11. No-match and partial-data cases are handled without crashes or false certainty.
12. Comparison handles mixed known/missing values.
13. Admin sign-in handles invalid credentials, logout and unauthorized direct API calls.
14. Admin create/update/unpublish item changes public views and persists after restart.
15. Invalid negative nutrients, bad IDs, invalid URL/input, malformed body, unauthorized role, malicious strings fail safely and visibly.
16. Reload/bookmark pages work without relying on previous client navigation.
17. Accessibility keyboard flow works: skip link, nav, form, dialog, errors, focus states.
18. Browser console has no unhandled runtime errors; assets load and no mobile horizontal overflow.
19. Production build, lint, strict TypeScript, unit/integration/E2E and CI pass.
20. No secret files in tracked Git history; no console/README secret leaks. Verify the actual GitHub commit/push results.
21. Deployment (if credentials) is verified on its actual public URL, including DB access, not just successful Vercel CLI output.
22. Presentation screenshots/report figures reflect the real running application and actual schema, not marketing mockups.

## 9. University academic evidence/report deliverables

**Rubric mapping:** The supplied rubric has **10 Report Evaluation criteria**, **4 Presentation Assessment criteria**, and **6 Continuous Assessment criteria** on a 0–5 scale. Track each criterion by its exact name and link to genuine evidence. It also includes a maximum 10-mark plagiarism/AI-detection deduction clause; do not try to game detectors, and respect institution policies.

Report criteria: Completeness of Report; Clarity of Abstract; Report Structure & Presentation Quality; Language and Grammar; Clarity and Quality of Project Objectives and Summary; Quality of Literature Review; Quality of Diagrams/Figures/Tables/Pictures; Detailed and Completeness of Systems Analysis; Detailed and Completeness of Systems Design; Quality of Content Representing Work Done.

Presentation criteria: Quality of Presentation Material; Relevance of Content; Presenter’s Presentation Quality and Approach; Ability to Handle Questions.

Continuous criteria: Resourceful; Diligence; Independent; Creativity and Problem Solving Ability; Quality and Completeness of Work; Communication and Interaction. The excellent communication descriptor mentions **more than six actual supervisor meetings**. Provide a **blank supervisor meeting log** for genuine entries; do not fabricate meetings.

**Official report organization:** approval, title, signed originality declaration, abstract, optional acknowledgements, TOC, list of figures, list of tables, list of appendices; then Chapter 1 Introduction, Chapter 2 Literature Review, Chapter 3 Methodology, Chapter 4 System Analysis and Design, Chapter 5 System Design, Chapter 6 Conclusion; references and appendices. Follow the guideline's chapter descriptions, even though implementation/testing content may logically sit within Chapter 5 or appendices. Preserve internally consistent headings, actual diagrams and system details. Confirm faculty expectations before finalizing questionable front-matter examples.

**Guideline formatting:** Times New Roman 12pt, double-spaced body, A4, margins left 4cm and top/right/bottom 2cm; page numbers 8pt bottom-right (preface uses Roman numerals except approval/title), abstract one paragraph ≤400 words; Chapter heading 14pt bold, second level 12pt bold, third level 12pt italic; figure captions *below*, table captions *above*; APA references. Include exact supervisor/candidate metadata **only from verified approved materials and confirmed user review**.

Create alongside the code:
- `docs/requirements.md`: numbered functional/nonfunctional requirements with acceptance criteria and user roles.
- `docs/rubric-mapping.md`: each rubric item, expected evidence, current status, links to actual code/tests/figures.
- `docs/architecture.md`, `docs/database.md`, `docs/recommendation-algorithm.md`, `docs/security.md`, `docs/testing.md`, `docs/deployment.md`.
- Actual diagrams sourced from current implementation: architecture, use-case diagram, ERD, activity/flowchart, recommendation decision flow, perhaps a simple sequence diagram. Source as Mermaid/PlantUML and export to embedded graphics only if tooling works. Correctly number figures/tables in the report draft.
- `docs/evidence/` with real test log files and actual screenshots from browser runs (only store screenshots without passwords/secrets or personal info). Reference commit SHAs where useful.
- `docs/report/` with clearly marked **DRAFT**: six actual chapters written progressively from tested software and verifiable public sources; source register with real reference URLs and access dates; APA-formatted bibliography; templates for approvals, declaration and signatures; user testing questionnaire, blank participant consent, blank results table, and evidence synthesis template.
- `docs/presentation/` with an accurate suggested 8–12-slide narrative, 5–7 minute demo script (adjust to faculty timing), probable supervisor questions and evidence-based answers.
- `docs/supervisor-log.md` blank until real meetings are reported. The project deadline/Gantt chart must match actual checkpoints, with planned vs actual dates clearly separated.

Do not fabricate usability study participants, percentages, nutritional provenance, academic citations, academic signatures, or outcome statistics. If DOCX/PDF generation is supported, produce editable report draft with correct formatting, plus a print-preview PDF; otherwise produce a detailed Markdown report draft and documented export method. **Never assert the written report is academically approved or submission-ready until human review/signatures/evaluation are complete.**

Literature-review themes: web-based menu systems; nutrition information and food composition databases; transparent rule-based recommender systems; dietary preference handling; usability/accessibility and web security. Compare actual relevant published systems and papers (with verifiable citations). Potential reliable sources to verify and cite: MyFCD `https://myfcd.moh.gov.my/`, USDA FoodData Central `https://fdc.nal.usda.gov/`, WHO Healthy Diet `https://www.who.int/news-room/fact-sheets/detail/healthy-diet`, and relevant peer-reviewed literature. Never invent study titles, authors, volumes or DOIs. If internet access is blocked, leave `SOURCE REQUIRED` placeholders for later research.

## 10. Required scripts, setup, and repeatability

Ensure package scripts or documented equivalents exist and actually work:

```text
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm db:generate
pnpm db:migrate
pnpm db:deploy
pnpm db:seed
```

Use `docker compose up -d db` for local PostgreSQL if Docker is available; alternatively use a supplied PostgreSQL DATABASE_URL. Create a `.env.example` with names only and comments, not actual secrets; runtime validation should explain missing prerequisites without leaking values. Use separate disposable test database. Migrations must work from a fresh checkout. Provide platform-neutral setup docs including macOS/Windows/Linux where relevant.

GitHub Actions should execute test and migration checks with a PostgreSQL service; publish results/artifacts only when they do not expose secrets or personal data. Do not add external paid infrastructure merely to satisfy CI.

## 11. Deadline priority and scope control

Treat **12 November 2026** as internal feature and document freeze. Recommended target checkpoints:
- 15–18 October: CP-00 through CP-04.
- 19–25 October: CP-05 through CP-13, with working core recommendations by 25 Oct.
- 26 October–1 November: CP-14 through CP-18, complete admin and application flows.
- 2–8 November: CP-19 through CP-22, testing, security, deployment and evaluation support.
- 9–12 November: CP-23, report/diagrams/defense and final defect fixes.
- 13–14 November: verification buffer, no new optional features.
- 15 November: university submission deadline.

These are planning targets, not fabricated actual historical progress. Record actual dates. If schedule becomes tight, cut OPTIONAL features (dark mode, extra charts, extra animation, persistent ordinary user accounts, PDF export, elaborate analytics), NEVER core safety, critical pages, testing, deployment setup, user evidence and required documentation. Do not spend days polishing hero animation while recommendation/admin functionality is broken.

## 12. Final acceptance contract and response

Before declaring the project finished, perform a clean-install rehearsal (separate directory or CI checkout), run migrations + idempotent seed, start app, navigate through complete public journey, authenticate and perform admin mutation, run all checks, test mobile/tablet/desktop, examine CI, inspect git status, and verify recent commits actually exist on the remote. Tag/release safely only if all software release gates have passed.

Finish with a concise **truthful release report** containing:
1. Repository URL, working branch and latest commit SHA; confirmed remote push status and any PR URL.
2. Running app URL if actually deployed, otherwise exact local startup commands and deployment blockers.
3. Stack and actual version numbers, database setup, migration/seed results.
4. Feature checklist with proof/routes; brief description of scoring method and all limitations.
5. Table of CP-00..CP-23 with status, commit SHA, test evidence and push status.
6. Actual tests run: command, pass/fail counts, real Playwright screenshots and devices/viewport sizes, real GitHub Actions result where accessible.
7. Security and nutrition-data provenance review, remaining known limitations and unresolved issues.
8. Academic/report files and rubric evidence mapping; identify specifically what still requires **student participation**, genuine user testing, supervisor sign-off or institution approval.
9. Exact steps to demonstrate the system and 5–10 defense questions with grounded answer pointers.
10. A final status chosen from **RELEASE VERIFIED**, **FUNCTIONAL BUT PARTIALLY UNVERIFIED**, or **BLOCKED**, with reasons; do not conflate software release with university acceptance.

**Start now. First inspect the repository and university inputs, post a short action plan, then implement CP-00, verify, commit and push, and continue through CP-23 without routine permission pauses. Do not respond with a plan alone.**
