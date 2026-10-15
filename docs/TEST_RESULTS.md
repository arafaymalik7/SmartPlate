# Test Record — SMARTPLATE v1.0

**Date:** 15 October 2026 · **Environment:** Python 3.13, FastAPI 0.128, pytest 9, local SQLite. Automated checks executed in the code-creation environment.

## Executed checks

| Test | Result | Evidence |
| --- | --- | --- |
| `python -m pytest -q` | **PASS — 20 tests** | `tests/test_api.py`, `tests/test_recommender.py` |
| Public restaurants and menus | PASS | TestClient receives 4 restaurants / 48 menu entries |
| Recommendation request, invalid request, vegan/vegetarian restriction | PASS | Validation and filter assertions |
| Ingredient/allergen fail-closed filtering | PASS | Unit tests |
| Missing nutrient semantics and ranking determinism | PASS | Unit tests |
| Priority scoring changes | PASS | Unit tests |
| Admin login invalid credentials and throttling | PASS | Integration tests |
| Session enforcement and CSRF | PASS | Integration tests |
| Restaurant and menu CRUD | PASS | Integration tests |
| Public visibility and unknown-route handling | PASS | Integration tests |
| Nutrition URL scheme guard | PASS | Integration test |
| `node --check static/app.js` | PASS | JavaScript parser check |
| HTTP `/api/health` | PASS | 200 and 48 items on local Uvicorn instance |

## Browser / user evaluation status

**NOT VERIFIED IN THIS ENVIRONMENT:** Desktop/mobile visual and interaction walkthrough. The installed managed Chromium browser enforces an administrator URL blocklist and rejects both localhost and file URLs. This is a testing-environment restriction, not a confirmed application error or pass. Independently conduct the browser test script using normal Chrome, Safari, Firefox or Edge before submission. **Do not claim successful real-browser testing or user satisfaction without evidence.**

## Manual acceptance procedure (to complete)

| ID | Procedure | Expected result | Actual outcome | Date / tester |
| --- | --- | --- | --- | --- |
| UAT-01 | Load homepage desktop and mobile | No clipping, mobile menu opens | PENDING | ___ |
| UAT-02 | Search "tofu" | Matching dishes appear | PENDING | ___ |
| UAT-03 | Filter vegetarian | Non-vegetarian entries excluded | PENDING | ___ |
| UAT-04 | Inspect meal detail | Six nutrient values and illustrative disclaimer | PENDING | ___ |
| UAT-05 | Add two items to comparison | Side-by-side numeric table | PENDING | ___ |
| UAT-06 | Recommend 550-kcal meals | Ranked explanations and caveats | PENDING | ___ |
| UAT-07 | Exclude peanut allergen | No suggestions; unverified data explained | PENDING | ___ |
| UAT-08 | Sign in with provisioned admin | Admin dashboard accessible | PENDING | ___ |
| UAT-09 | Create and edit a demo meal | Changes appear publicly | PENDING | ___ |
| UAT-10 | Sign out and revisit admin | Protected data inaccessible | PENDING | ___ |

## User evaluation

No participants recruited, questionnaires distributed or responses collected at the time this document was prepared. Use `USER_TESTING.md` to run actual task-based sessions, collect real results, produce statistics and discuss limitations. Do not invent responses to populate charts.
