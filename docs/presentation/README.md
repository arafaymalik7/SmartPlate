# Presentation and defense draft

Suggested 10-slide, 5–7 minute draft:

1. Project title, problem and intended users.
2. Objectives and scope boundaries: informed menu exploration, not medical diagnosis.
3. User requirements and transparent illustrative-data policy.
4. Architecture diagram from `docs/diagrams.md`.
5. Database/ERD and nullable nutrition/disclosure modelling.
6. Rule-based recommendation flow, weights and deterministic ordering.
7. Public journey: directory, menu filters, nutrition detail and comparison.
8. Admin/security model: Auth.js, Zod, origin guard and audit trail.
9. Real evidence: local checks, browser screenshots and current CI status.
10. Limitations, database/deployment prerequisites and next verification steps.

Demo script: open the restaurant directory, demonstrate a no-results reset, open a menu and filter to verified vegan items, inspect an item with a missing nutrient, compare meals, then show the recommendation warning for an allergy-related exclusion. State that the venues and values are fictional/illustrative and that unknown disclosure is never marked safe.

Defense point: SMARTPLATE deliberately treats missing nutrition and allergen disclosures as unknown rather than zero or safe. The current demo dataset is fictional and illustrative.
