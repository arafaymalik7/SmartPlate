# SMARTPLATE — Software Requirements Specification (SRS)

Revision 1.0 · 15 October 2026 · Scope aligned with the approved project proposal.

## Stakeholders

- Guest customers and health-conscious individuals who want to explore nutrition and diet preferences.
- Restaurant staff and administrators who maintain digital menus.
- Students and working professionals making quick informed meal comparisons.
- Minor project supervisor and examiners evaluating engineering process and outcome.

## Functional requirements and acceptance evidence

| ID | Requirement | Acceptance criterion | Code location |
| --- | --- | --- | --- |
| FR-01 | Browse restaurants | Public endpoint lists published venues | GET `/api/restaurants` |
| FR-02 | Browse menus | Menus filtered by active restaurant | GET `/api/restaurants/{slug}` |
| FR-03 | Search meals | Name/category/description case insensitive | GET `/api/items?q=` |
| FR-04 | Filter meals | Category, vegetarian, restaurant filters | `static/app.js` |
| FR-05 | View nutritional data | Display 6 values per serving, N/A when unknown | Detail modal |
| FR-06 | Explain provenance | Show type and optional URL, flag illustrative seed | Detail and About views |
| FR-07 | Configure preferences | Target calories, diet, nutrient priority, price, restrictions | `/recommend` |
| FR-08 | Exclude unsuitable items | Apply strict eligibility rules; unknown allergy source fails closed | `recommender.py` |
| FR-09 | Explain recommendation | Score components and supporting measured values | `recommender.py` |
| FR-10 | Handle no results | Empty state plus explanation of exclusions | `/recommend` |
| FR-11 | Compare meals | Side-by-side table, no more than 3 entries | `/compare` |
| FR-12 | Save favorites | Local browser state without guest registration | `static/app.js` |
| FR-13 | Authenticate admin | Unique admin credentials, secure hashed password | `security.py` |
| FR-14 | Manage restaurants | Admin can create/edit/delete and publish/unpublish | `/api/admin/restaurants` |
| FR-15 | Manage menu items | Admin can create/edit/delete, mark available, set nutrients | `/api/admin/items` |
| FR-16 | Audit edits | Log admin create/update/delete operations | `audit_events` |

## Non-functional requirements

| ID | Requirement | Validation approach |
| --- | --- | --- |
| NFR-01 | Responsive | Manually review mobile 390px, tablet 768px, desktop 1440px |
| NFR-02 | Accessible | Semantic structure, focus-visible, labels, keyboard navigation; audit separately |
| NFR-03 | Input validation | Pydantic constraints; invalid input returns HTTP 422 |
| NFR-04 | Data security | Parameterized SQL, scrypt hashing, CSRF, httponly session cookies |
| NFR-05 | Maintainability | Separated modules, documented methods and route schemas |
| NFR-06 | Transparency | Display illustrative provenance, never claim clinical reliability |
| NFR-07 | Reproducibility | Setup and deterministic local demo seed |
| NFR-08 | Testability | Automated unit/integration suite and a real-user evaluation procedure |

## Constraint register

1. Do not fabricate source verification of fictional menus.
2. No payment flow, scraping, OCR or deep learning is required by the approved proposal.
3. Rule-based recommendation is sufficiently explainable for the minor project.
4. Admin features are protected; guest usage requires no personal health data.
5. User evaluation and supervisor feedback must be genuinely obtained and documented.
