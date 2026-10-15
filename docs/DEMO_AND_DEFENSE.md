# Demonstration, Presentation & Defense Guide

## 8–10 minute presentation plan

| Slide | Content | Evidence |
| --- | --- | --- |
| 1 | Title, candidate, supervisor | Approved proposal |
| 2 | Problem context | Menu nutrition opacity; project scope |
| 3 | Aim, objectives, user groups | Requirements specification |
| 4 | Literature comparison | MFP vs Cronometer vs SMARTPLATE |
| 5 | Methodology | Iterative development and evidence |
| 6 | Architecture and schema | `docs/ARCHITECTURE.md` diagrams |
| 7 | Recommendation algorithm | Actual 40/30/20/10 heuristic |
| 8 | Live system demonstration | Home → menu → nutrition → recommendation → comparison |
| 9 | Validation | Real 20 automated tests; actual user feedback once collected |
| 10 | Conclusion & limitations | Fictional data, no clinical claims, future work |

## Live demonstration checklist

1. Start `python run.py`; open homepage and restaurant catalog.
2. Show vegetarian filter and per-serving nutrient modal; point to provenance disclaimer.
3. Open `/recommend`, set target 550 kcal, choose a priority and explain score/reasons.
4. Try strict allergen exclusion and demonstrate the conservative **no results** state.
5. Add two meals to compare and explain missing value handling.
6. Open `/admin` and sign in with a real admin account created in advance (never show password on screen).
7. Create a new demo meal, edit the sodium value, and verify the public display. Delete demo item to restore state.
8. Show `python -m pytest -q` if requested by the examiner.

## Likely examiner questions

**Is this AI?** This is a transparent, deterministic *rule-based recommendation system*, not a trained LLM or predictive medical model. The word “intelligent” in the approved title describes automated rule-guided selection.

**How accurate are the nutrition figures?** The included 48 item values are openly labelled illustrative. A real deployment needs ingredient quantities or certified restaurant data, standardized calculation and provenance checks.

**Why use SQLite instead of a production DB?** A local university prototype benefits from easy installation, relational constraints and testability. Higher traffic would justify PostgreSQL.

**What happens if a user specifies a peanut allergy?** Because the bundled dataset has no verified allergen declarations, the engine excludes all entries rather than saying any item is safe.

**How are rankings calculated?** Four components: calorie distance 40, chosen nutrition target 30, nutrient completeness 20 and fiber 10. These are disclosed design heuristics; different weights would change the outcome.

**How did you validate it?** Automated tests cover scoring, restrictions, CRUD and auth; manual browser and human user evaluations must be completed separately and honestly reported.
