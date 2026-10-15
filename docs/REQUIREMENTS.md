# SMARTPLATE — Software Requirements Specification (SRS)

Revision 1.1 · 15 October 2026 · Scope aligned with the approved project proposal and authoritative Next.js migration specification.

## Stakeholders

- Guest customers and health-conscious individuals who want to explore nutrition and diet preferences.
- Restaurant staff and administrators who maintain digital menus.
- Students and working professionals making quick informed meal comparisons.
- Minor project supervisor and examiners evaluating engineering process and outcome.

## Functional requirements and acceptance evidence

| ID | Requirement | Acceptance criterion | Target code area |
| --- | --- | --- | --- |
| FR-01 | Browse restaurants | Public route lists published venues | `/restaurants` |
| FR-02 | Browse menus | Published restaurant menu by slug | `/restaurants/[slug]` |
| FR-03 | Search meals | Name/category/description search and empty state | Restaurant menu filters |
| FR-04 | Filter meals | Category, diet and sort filters are truthful | Restaurant menu filters |
| FR-05 | View nutritional data | Per-serving values; `Not available` when unknown | `/menu/[slug]` |
| FR-06 | Explain provenance | Source type, date and optional URL shown | Item detail/admin |
| FR-07 | Configure preferences | Zod-validated non-sensitive controls, reset and local storage | `/recommend` |
| FR-08 | Exclude unsuitable items | Hard restrictions; unknown allergy data never marked safe | `src/lib/recommendation` |
| FR-09 | Explain recommendation | Deterministic score components and measured reasons | `src/lib/recommendation` |
| FR-10 | Handle no results | Explicit empty state and suggested adjustment | `/recommend` |
| FR-11 | Compare meals | Two or three meals, unknown values retained | `/compare` |
| FR-12 | Authenticate admin | Maintained auth, hashed secret, server-side sessions | `/admin` |
| FR-13 | Manage restaurants | Server-authorized CRUD and public visibility | `/admin/restaurants` |
| FR-14 | Manage menu items | Validated nutrition/provenance/ingredient management | `/admin/menu-items` |
| FR-15 | Audit edits | Actor/action/entity/time audit records | `AdminAuditLog` |

## Non-functional requirements

| ID | Requirement | Validation approach |
| --- | --- | --- |
| NFR-01 | Modern stack | Next.js, strict TypeScript, PostgreSQL and Prisma are present | package/schema/migration review |
| NFR-02 | Responsive | Review actual 375px, 768px, 1440px screenshots | Playwright evidence |
| NFR-03 | Accessible | Semantic structure, keyboard path, labels and focus states | Automated/manual audit |
| NFR-04 | Input/data security | Zod validation, server auth, parameterized Prisma operations | Negative integration tests |
| NFR-05 | Maintainability | Separated modules and documented decisions | Architecture review |
| NFR-06 | Transparency | Illustrative provenance and non-medical wording | Content/test review |
| NFR-07 | Reproducibility | npm, PostgreSQL migrations and idempotent seed | Clean-install/CI evidence |
| NFR-08 | Testability | Unit, integration, browser and CI suite | Test logs |

## Constraint register

1. Do not fabricate source verification of fictional menus.
2. No payment flow, scraping, OCR or deep learning is required by the approved proposal.
3. Rule-based recommendation is sufficiently explainable for the minor project.
4. Admin features are protected; guest usage requires no personal health data.
5. User evaluation and supervisor feedback must be genuinely obtained and documented.
6. Private university source originals are absent from this checkout and are ignored if provided later.
