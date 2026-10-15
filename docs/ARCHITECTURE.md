# SMARTPLATE — Technical Architecture and Design

## Architecture

```mermaid
flowchart TB
    G[Guest browser] --> UI[HTML / CSS / JavaScript UI]
    A[Administrator] --> UI
    UI --> API[FastAPI REST layer]
    API --> V[Pydantic validation]
    V --> REC[Rule-based recommendation engine]
    V --> AUTH[Admin sessions / CSRF]
    REC --> DB[(SQLite database)]
    AUTH --> DB
    V --> DB
```

The application is served from one server. It exposes public read endpoints and a separately protected `/api/admin/` namespace. Static frontend assets remain within the same origin, simplifying session-cookie and CSRF handling. SQLite is a justified, low-operations minor-project database decision.

## Data entities (actual schema)

```mermaid
erDiagram
    RESTAURANTS ||--o{ MENU_ITEMS : offers
    ADMINISTRATORS ||--o{ SESSIONS : owns
    ADMINISTRATORS ||--o{ AUDIT_EVENTS : performs
    RESTAURANTS { integer id PK string name string slug string cuisine boolean published }
    MENU_ITEMS { integer id PK integer restaurant_id FK string name string category real price real calories real protein real sodium string ingredients_json string allergens_json string nutrition_source_type }
    ADMINISTRATORS { integer id PK string username string salt string password_hash }
    SESSIONS { string token_hash PK integer admin_id FK string csrf integer expires_at }
    AUDIT_EVENTS { integer id PK integer admin_id FK string action string entity_type integer entity_id }
```

`menu_items` stores six nullable nutrients in the chosen units (kcal, g, mg). Ingredient and allergen labels are JSON string lists; for a larger multi-restaurant application, these should be normalized into lookup and junction tables. SQLite enforces foreign keys and cascade deletion of menu items when a restaurant is removed.

## Recommendation logic

```mermaid
flowchart TD
    P[Preferences] --> Q[Validate input]
    Q --> R[Read available published meals]
    R --> F{Eligible?}
    F -->|No| X[Count exclusion reason]
    F -->|Yes| S[Score 40/30/20/10]
    S --> T[Sort by score and target closeness]
    T --> U[Show explanations + limitations]
    X --> V[Expose exclusion summary]
    U --> V
```

**Scoring equation:** `S = 40C + 30P + 20D + 10F`, with all factors normalized to [0, 1]. `C` denotes calorie closeness, `P` selected priority, `D` nutrient completeness, `F` fiber heuristic. The weights are arbitrary engineering parameters and **must not be presented as validated health guidance**.

## Security controls

Admin passwords use per-user random salt and `hashlib.scrypt`, not plaintext; sessions store only a SHA-256 token digest in SQLite, and the secret session token is kept in an HttpOnly SameSite=Strict cookie. Mutation requests require an additional `X-CSRF-Token` sent by same-origin JavaScript. Public filters and all database CRUD use parameterized SQL values. A basic in-memory login throttle applies 8 failed attempts per 15 minutes per address; deploying multiple replicas would require centralized rate limiting.

## Risk and limitation management

- Missing information is represented as unknown; the recommendation algorithm never substitutes zero for missing nutrients.
- Exclusions for unverified ingredient/allergen data fail closed rather than return potentially unsafe meals.
- The demo cannot rule out real-world kitchen cross-contact, label errors or nutrition variation.
- Source attribution is required in UI; starter numerical values are marked illustrative.
- Exposing SQLite write access to an internet-facing untrusted deployment should not occur without appropriate server controls, HTTPS and backups.
