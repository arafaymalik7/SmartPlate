# SMARTPLATE — Complete Minor Project Software (v1.0)

**Approved title:** SMARTPLATE: A Web-Based Intelligent System for Analyzing Restaurant Menus and Providing Personalized Nutrition and Health-Aware Meal Recommendations  
**University:** UNITAR International University · ITWB2914 Minor Project  
**Submission deadline:** 15 November 2026

SMARTPLATE is a working full-stack educational prototype with restaurant menus, per-serving nutrition information, dietary preferences, deterministic explainable recommendations, comparison of up to three meals, local favorites, and a protected administrative workspace with restaurant/item CRUD and audit records.

> **IMPORTANT:** All four bundled restaurants are fictional. All 48 demo menu prices, portion sizes and nutritional values are **illustrative and not certified** by any restaurant, government nutrition database or laboratory. Allergen declarations are unverified, so strict allergen exclusions return no suggestions for the starter dataset. The system offers **general information**, not medical advice or allergy safety certification.

## Quick start (Windows / macOS / Linux)

Install **Python 3.11+**. No Node.js or external frontend build is required.

```bash
# In this folder:
python -m venv .venv
# On macOS/Linux: source .venv/bin/activate
# On Windows (PowerShell): .venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m smartplate.cli init
python run.py
```

Visit **http://127.0.0.1:8000**. The first start creates an SQLite database under `data/`, and seeds 4 fictional restaurants with 48 illustrative dishes. Re-running seed does not duplicate data.

### Administrator setup

There is **no built-in default admin password**. Use:

```bash
python -m smartplate.cli create-admin --username admin
# Type a unique password of at least 12 characters when prompted.
```

Then visit http://127.0.0.1:8000/admin and sign in. To change the password:

```bash
python -m smartplate.cli change-password --username admin
```

**Never put admin passwords in a report, source file, screenshot or Git repository.** The admin CLI uses a secure terminal prompt. Admin login is session-cookie based, uses Python scrypt password hashing, and requires a CSRF token on changes.

## What is implemented

| Module | Functionality |
| --- | --- |
| Home | Hero, featured dishes, how it works, restaurant directory |
| Restaurant directory | Four demo restaurants, restaurant menus |
| Menu exploration | Full text search, category filter, restaurant filter, vegetarian toggle |
| Nutrition detail | Calories, macro values, sodium, fiber, ingredients, allergen caveat, source type |
| Preferences | Per-meal calorie target, dietary style, nutrition priority, price, exclusions, restaurant |
| Recommendation engine | Eligibility rules + four-component deterministic 100-point score + explanations |
| Comparison | Two or three meals side-by-side; browser local storage |
| Favorites | Browser local storage, no guest account required |
| Admin authentication | CLI-provisioned admin, scrypt password hashing, rotating session token, cookie, CSRF |
| Admin management | Create/edit/delete restaurants and menu items, publication and availability flags |
| Safety | Explicit unverified data notices, conservative exclusions, parameterized SQL queries |
| Verification | Pytest unit + API tests, Python compilation, JavaScript syntax |
| API docs | Interactive API definition at `/docs`, JSON schema at `/openapi.json` |

## Verification

```bash
python -m pytest -q
python -m compileall -q smartplate
node --check static/app.js   # Optional if Node.js is installed
```

As of 15 Oct 2026 the automated suite **passed 20/20 tests** in the creation environment. Browser visual testing and real participant evaluation still require independent confirmation. See `docs/TEST_RESULTS.md`.

## Technology and architecture decision

**FastAPI + SQLite + vanilla HTML/CSS/JavaScript**. The earlier *planning-only* proposal considered Next.js/PostgreSQL; this finished deliverable uses a lighter architecture so it can run locally, without an external database, npm downloads or a build step. It provides equivalent project scope. The final report describes the **actual implementation**, not the abandoned design. The Python project can later be migrated to hosted PostgreSQL; this is not claimed as completed.

- `smartplate/api.py`: validated HTTP endpoints, public data access, protected admin routes
- `smartplate/database.py`: SQLite schema and SQL helpers
- `smartplate/seed.py`: deterministic illustrative 48-dish demo data
- `smartplate/recommender.py`: transparent rule-based algorithm
- `smartplate/security.py`: admin password and session handling
- `smartplate/schemas.py`: Pydantic validations
- `smartplate/cli.py`: initial setup and admin management
- `static/index.html`, `styles.css`, `app.js`: responsive frontend
- `tests/`: unit and API automated checks
- `docs/`: university-specific engineering and submission evidence
- `report/`: academic draft and supporting figures

## Configuration

| Variable | Default | Meaning |
| --- | --- | --- |
| `SMARTPLATE_DB` | `data/smartplate.db` | Writable SQLite file path |
| `SMARTPLATE_HOST` | `127.0.0.1` | Listen address; keep local unless behind a reverse proxy |
| `SMARTPLATE_PORT` | `8000` | Local HTTP port |
| `SMARTPLATE_COOKIE_SECURE` | `0` | **Set to `1` behind HTTPS** |

See `docs/DEPLOYMENT.md` before exposing to the internet. Do **not** publish a demo with a test admin account, plaintext passwords or HTTP admin login. For production, configure HTTPS, backups, logging, a hosted process and persistent rate limiting. A university demonstration on localhost is sufficient unless live deployment is explicitly required.

## Project limitations

- Nutritional values are illustration-only and are not intended to make actual dietary decisions.
- Never claim an item is safe for a food allergy; even verified declarations do not preclude cross-contact.
- The demo is single-server and SQLite-backed, not high-availability or multi-tenant.
- Guest favorites and preferences are stored only in the current browser; there is no synchronization.
- Language is English, display currency is demonstrative MYR.
- No trained machine learning model, OCR, scraping, food image analysis or clinical recommendation engine exists.

## Academic integrity

The report in `report/` is a **structured draft based on implemented code and automated tests**. It does not contain invented participant responses, supervisor approvals, medical validation, deployment URLs or browser screenshots. Before final submission, perform actual user testing, add findings/screenshots, confirm author/candidate/course details, review citations and obtain the required signatures.

## Licence

Educational demonstration project. Data entries and texts in demo menus were prepared synthetically and should not be described as third-party restaurant records. Third-party libraries retain their respective licences.
