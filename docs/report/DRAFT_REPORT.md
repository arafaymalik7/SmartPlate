# SMARTPLATE: transparent restaurant-menu decision support

> **Submission status:** working technical report, not a final university submission. Replace bracketed fields, add real institutional metadata, and obtain genuine supervisor and user-study evidence before submission. This document deliberately does not invent approvals, participants, deployment results, or nutrition-data provenance.

## Abstract

SMARTPLATE is a web application that demonstrates how restaurant-menu choices can be made easier to inspect when nutrition, ingredient, and allergen information is incomplete. It provides a public directory, menu browsing and item-detail pages, a bounded comparison tool, and a preference-driven recommendation view. The current product data consists of clearly labelled, fictional illustrative restaurants and dishes; it is not a live restaurant catalogue or medical advice. A Next.js TypeScript application supplies the interface, a pure deterministic recommendation engine explains eligibility and ranking, and a Prisma/PostgreSQL schema is prepared for managed records and audit data. Administrative mutations are server guarded, validated, and origin-checked.

The implementation was verified locally with linting, strict TypeScript, unit tests, a production build, and responsive Playwright journeys. GitHub Actions also ran the committed migration and seed against an ephemeral PostgreSQL 16 service before running the application checks. Database-backed public reads, real admin sign-in/mutations, deployment, user evaluation, and university review have not been completed in the available environment. The report therefore documents capabilities and limitations separately, particularly the rule that absent allergy or nutrition information remains _unknown_, never safe. The planned next stage is to obtain permitted, cited menu data; conduct approved user testing; and validate a deployed system with a managed PostgreSQL environment.

## Chapter 1 — Introduction

### 1.1 Problem and motivation

Restaurant menus often omit, simplify, or change nutrition, ingredient, and allergen disclosure. This creates a practical information problem for people who want to compare dishes while respecting a diet or avoidance preference. Healthy dietary guidance is context dependent; the World Health Organization emphasises adequacy, balance, moderation, and diversity rather than a single universal menu choice [1]. A decision-support tool must therefore expose its data limits rather than present a calculated score as medical certainty.

### 1.2 Aim and objectives

The aim is to build a transparent menu-discovery and decision-support system. The implemented objectives are to:

1. present labelled restaurant and menu information;
2. show nutrition, ingredient, diet, and allergen disclosure fields, including unavailable values;
3. allow filtering, bounded comparison, and deterministic recommendations;
4. treat unknown allergy disclosure as ineligible when the user supplies an allergy-related exclusion;
5. provide a PostgreSQL/Prisma model and a guarded administration foundation;
6. verify code and public UI journeys with reproducible automation.

The project does not diagnose conditions, guarantee allergen safety, claim live restaurant data, or replace professional dietary advice.

### 1.3 Scope

The current public experience covers fictional illustrative records only. The implementation contains a versioned PostgreSQL migration and idempotent seed for the same illustrative model. It does not yet include approved external menu ingestion, payment, delivery ordering, accounts for general consumers, or production analytics. The admin surface is deliberately limited until a real database and administrator credentials are available for acceptance testing.

## Chapter 2 — Literature and evidence context

This chapter is a concise evidence context, not a claim that the listed sources supplied the app's fictional dish values. The source register records stable URLs and the role of each source.

WHO describes healthy diets as dependent on individual characteristics, cultural context, available food, and dietary customs [1]. That supports the project's preference-driven presentation and its refusal to label a single choice universally healthy. WHO also identifies sodium, free sugars, and fats as information relevant to dietary choices [1].

USDA FoodData Central is an authoritative example of a structured food-data service [2]. It is a prospective reference for future verified ingredient or nutrition work, not a substitute for a restaurant's recipe-level declaration. No FoodData Central result is currently imported into the product.

For web protection, the OWASP CSRF Prevention Cheat Sheet recommends server-side request validation appropriate to the authentication design [3]. SMARTPLATE applies an explicit same-origin check before current browser admin mutations, alongside server-side session authorization and schema validation. This is a defense-in-depth control, not a claim of complete production security.

## Chapter 3 — Methodology

### 3.1 Development approach

The work followed incremental checkpoints: establish the application and schema, add a bounded illustrative dataset, implement public decision-support flows, add protected mutation routes, then verify and document each increment. The method favoured a deterministic pure ranking module so its safety rules can be unit tested independently of the UI or database.

### 3.2 Data and uncertainty policy

Each demonstration dish identifies itself as illustrative and carries a source label. Nullable nutrition values display as unavailable. Ingredient and allergen disclosure use explicit states; a missing disclosure is never converted into a positive safety statement. Guest preference inputs are restricted to meal controls, with allergy-related exclusions held only for the current browser session rather than being silently persisted.

### 3.3 Verification method

The verification ladder is: static linting, strict TypeScript checking, deterministic unit tests, a production build, then browser journeys at 375px, 768px, and 1440px. The committed CI workflow provisions an ephemeral PostgreSQL 16 service, applies the migration, runs the seed, and then runs the same application checks. Evidence and limitations are maintained in `docs/testing.md`, `docs/implementation-progress.md`, and `docs/final-qa-checklist.md`.

No human-subject evaluation was run. A future study must define recruitment, consent, task protocol, measures, and applicable ethical approval before it is reported.

## Chapter 4 — System analysis and design

### 4.1 Users and use cases

Public users can discover restaurants, browse a menu, inspect one dish, compare two or three dishes, and request a recommendation based on stated preferences. An administrator is intended to create and maintain restaurants, categories, and menu items once authentication and PostgreSQL are available.

### 4.2 Architecture

The system uses the Next.js App Router with TypeScript. Client components are limited to interactive public controls. Server routes form the boundary for validation, authentication, origin checks, Prisma access, and audit writes. Prisma 7 maps the relational model to PostgreSQL. The pure recommendation engine ranks eligible candidates and returns explanations and limitations. Implementation-derived architecture, entity-relationship, data-flow, and admin sequence diagrams are maintained in `docs/diagrams.md`.

### 4.3 Data model and decision logic

The schema models users/sessions, restaurants, categories, menu items, nullable nutrition, ingredients, allergens, and admin audit records. A recommendation first rejects incompatible dietary states and unknown allergy disclosure where an allergy-related exclusion is supplied. Remaining dishes are scored according to the selected priority; ties use stable ordering. The interface shows why a result was included and what fields are unavailable.

## Chapter 5 — Implementation and evaluation

### 5.1 Implemented features

The public routes offer searchable restaurant discovery, filterable menu browsing, dish-level disclosure, recommendations, and a two-to-three item comparison. The administration foundation includes Auth.js credentials, scrypt-based password verification, server-side authorization, Zod validation, same-origin request checks, transactional audit creation, and create endpoints for restaurants, categories, and menu items.

The codebase includes a Prisma PostgreSQL schema, baseline migration, and an idempotent 4-restaurant/48-dish illustrative seed. CI successfully ran that migration/seed flow against an ephemeral PostgreSQL service at commit `50981b4`; see the implementation ledger for the exact run evidence.

### 5.2 Evaluation evidence

The latest recorded local application checks passed linting, strict TypeScript, 14 Vitest tests, a production build, and 21 Playwright checks (seven journeys across three viewport projects). Reviewed captures are stored in `docs/evidence/`. Browser coverage includes public discovery, comparison, filtering, unknown-allergen messaging, generated crawl metadata, and keyboard skip navigation.

This evidence does **not** demonstrate real restaurant accuracy, an authenticated admin journey, production hosting, a local Docker database, or user satisfaction. Those remain acceptance criteria for the next stage.

### 5.3 Limitations and risks

The product is a demonstration until data owners provide current, permitted menu information with a review process. Allergens can vary by preparation and cross-contact; interface labels cannot certify safety. The current admin UI is not full CRUD, rate limiting has not been implemented, and no deployment has been verified. These limits are visible in the release notes and security documentation rather than being hidden by fallback data.

## Chapter 6 — Conclusion and future work

SMARTPLATE establishes a transparent technical foundation for restaurant-menu decision support: uncertainty is explicit, ranking is explainable, and the database/security path is designed and exercised in CI. The work should not be presented as a completed commercial or clinical service.

The next priorities are to obtain an approved non-production PostgreSQL environment; perform real administrator login, CRUD, audit, logout, and unauthorized-request checks; deploy with the correct public origin; implement production rate limiting; onboard permitted reviewed menu data; and conduct an approved, honestly reported user evaluation. The student should then replace the draft metadata and append the genuine supervisor feedback and institutional requirements.

## References

1. World Health Organization. _Healthy diet_. 26 January 2026. Available at: https://www.who.int/news-room/fact-sheets/detail/healthy-diet (accessed 15 October 2026).
2. U.S. Department of Agriculture, Agricultural Research Service. _FoodData Central_. Available at: https://fdc.nal.usda.gov/ (accessed 15 October 2026).
3. OWASP Foundation. _Cross-Site Request Forgery Prevention Cheat Sheet_. Available at: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html (accessed 15 October 2026).
