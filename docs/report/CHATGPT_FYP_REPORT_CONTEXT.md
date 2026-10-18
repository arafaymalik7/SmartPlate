# SMARTPLATE FYP report handoff

Copy this entire file into a new ChatGPT conversation before asking it to write the final FYP report. Attach the screenshots ZIP from this folder and any university rubric/template you have.

## Prompt for the report-writing assistant

You are preparing a final-year-project report for SMARTPLATE. Use the facts below and do not invent university metadata, deployment evidence, user-study participants, supervisor approvals, real restaurant partnerships, medical claims, or production database results. Ask for any missing institutional requirements before finalising the title page, declaration, acknowledgement, methodology approvals, and formatting.

Write in formal academic English. Create a complete report with: abstract, acknowledgements placeholder, table-of-contents placeholder, Chapter 1 introduction, Chapter 2 literature review, Chapter 3 methodology, Chapter 4 system analysis and design, Chapter 5 implementation, Chapter 6 testing/evaluation, Chapter 7 conclusion and future work, references, appendices, screenshot captions, and a requirements-to-features mapping. Use Harvard/APA style only after the university style is known.

## Project identity

- Project name: SMARTPLATE
- Working title: **SMARTPLATE: A Web-Based Intelligent System for Analysing Restaurant Menus and Providing Personalised Nutrition and Health-Aware Meal Recommendations**
- Purpose: help people explore restaurant menus, compare per-serving nutrition, inspect ingredients/dietary/allergen information, and receive deterministic preference-based meal suggestions.
- Product boundary: informational meal exploration only. It does not diagnose conditions, provide medical advice, or certify allergy safety.
- Latest implementation commit: `1eff05b540893b10f966a8928820bd6d0fc0d638` (`feat(ui): polish public product presentation`), pushed to `codex/smartplate-complete`.

## Implemented system

### Public user features

1. Responsive home page with navigation and accessible skip link.
2. Searchable and location-filterable restaurant directory.
3. Restaurant menu pages with search, category, diet, and sort controls.
4. Individual menu-item pages with serving size, nutrition, ingredients, dietary state, allergen disclosure, source record, and review date.
5. Meal comparison tool limited to two or three dishes, with a responsive per-serving table.
6. Preference-driven recommendations using a calorie target, diet, nutrition priority, excluded ingredients, and allergy-related exclusions.
7. Explainable deterministic results: strict exclusions are applied before ranking; matching reasons and limitations are shown.
8. Public help, methodology, disclaimer/privacy, error, loading, not-found, sitemap, robots, and status routes.

### Administration foundation

1. Protected administrator sign-in and server-side session guard.
2. Validated server routes for restaurants, categories, menu items, summary, and audit records.
3. Zod input validation, same-origin mutation checks, rate limiting, password hashing, and audit logging architecture.
4. Prisma/PostgreSQL schema and migrations for restaurants, menu items, nutrition, ingredient/allergen disclosure, users/sessions, and audit logs.

### Technical stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind/PostCSS and custom CSS design system
- Prisma 7 with PostgreSQL schema
- NextAuth/Auth.js credentials flow
- Zod validation
- Vitest unit/component tests
- Playwright browser tests
- GitHub Actions workflow

## Recommendation logic

- The engine is pure, deterministic, typed, and unit tested.
- It first applies strict diet and allergy-related exclusions.
- An unknown allergy disclosure is not treated as safe when the user enters an allergy-related exclusion.
- Remaining dishes are scored using calorie fit and the selected nutrition/diet priority.
- Results disclose matching reasons and unavailable nutrition fields.
- Do not call this a clinical AI system, medical diagnosis, or allergy guarantee.

## Dataset and evidence boundaries

- The current local public catalogue contains four seed restaurants and 48 dishes used to exercise the interface.
- The production-ready data model supports source records, review dates, nullable nutrients, and disclosure states.
- Missing nutrition is represented as `Not available`, never zero.
- Real restaurant-data provenance, live database acceptance, cloud deployment, human user evaluation, and university/supervisor approval must not be claimed without separately supplied evidence.
- The current public UI uses polished product language. In the academic report, describe the provenance and evaluation boundaries accurately rather than making unsupported live-service claims.

## Latest verified local quality results

Run on the latest UI handoff:

| Check | Result |
| --- | --- |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm test` | 29 tests passed across 13 files |
| `npm run build` | Passed; 20 application route families generated/compiled |
| `npm run test:e2e -- --reporter=line` | 33 browser tests passed; 12 database/admin-only checks skipped because no database credentials were supplied |
| Responsive visual review | Completed at 375px, 768px, and 1440px |

## Screenshots available

The attached screenshots archive contains these categories at desktop (1440px), tablet (768px), and mobile (375px):

- home page
- restaurant directory
- menu filter flow
- menu-item detail
- meal comparison
- personalised recommendation flow
- protected administrator entry state

Use figures selectively in the report, with captions such as “SMARTPLATE restaurant directory at desktop viewport” rather than making claims that a capture proves production deployment.

## Available source and draft material

- `DRAFT_REPORT.md`: earlier working report draft. It is useful source material but contains earlier wording and older test counts; reconcile it against this handoff file.
- `source-register.md`: register of WHO, USDA FoodData Central, and OWASP sources used for project context. These sources are not the source of restaurant-specific dish values.
- `docs/diagrams.md`: implementation-derived architecture, ERD, recommendation, and admin-flow diagrams.
- `docs/implementation-progress.md`: checkpoint ledger and historical verification evidence.
- `README.md`: runtime and project overview.
- `SMARTPLATE_CODEX_MASTER_PROMPT.md`: project specification.

## Suggested report evaluation language

State that automated verification covered static analysis, strict typing, deterministic unit/component checks, production build compilation, public browser journeys, keyboard skip navigation, responsive viewports, crawl metadata, protected unauthenticated admin access, and unauthenticated admin API rejection. Clearly separate this from any claims about real users, deployed infrastructure, authenticated database CRUD, or real-world restaurant accuracy.

## Information the student must provide before final submission

1. Student name, ID, programme, department, university, supervisor, and submission date.
2. University report template, required chapter headings, word count, citation style, and rubric.
3. Genuine user-testing or supervisor-review evidence, if such evaluation has been conducted.
4. Any approved deployment URL/database evidence, only if actually available.
5. Preferred figure order and which screenshots should be included.
