# Implementation-derived diagrams (draft)

These diagrams reflect the checked-in application as of the linked implementation ledger. They are source diagrams for the report draft, not a claim of university approval.

## Figure 1. Runtime architecture

```mermaid
flowchart LR
  Browser[Browser]
  Public[Next.js public routes]
  Client[Client controls: filters and non-sensitive preferences]
  Engine[Pure recommendation engine]
  Guard[Auth.js session + origin guard]
  Api[Admin route handlers]
  Validate[Zod validation]
  Prisma[Prisma 7 + pg adapter]
  Db[(PostgreSQL)]
  Browser --> Public
  Browser --> Client
  Client --> Engine
  Browser --> Api
  Api --> Guard --> Validate --> Prisma --> Db
  Public -. database-backed read path pending verification .-> Prisma
```

## Figure 2. Core data model

```mermaid
erDiagram
  User ||--o{ Session : has
  User ||--o{ AdminAuditLog : creates
  Restaurant ||--o{ MenuCategory : contains
  Restaurant ||--o{ MenuItem : offers
  MenuCategory o|--o{ MenuItem : groups
  MenuItem ||--o| MenuItemNutrition : has
  MenuItem ||--o{ MenuItemIngredient : discloses
  Ingredient ||--o{ MenuItemIngredient : names
  MenuItem ||--o{ MenuItemAllergen : discloses
  Allergen ||--o{ MenuItemAllergen : names
```

## Figure 3. Recommendation decision flow

```mermaid
flowchart TD
  Start[Menu candidates + preferences] --> Active{Available?}
  Active -- no --> Excluded[Excluded]
  Active -- yes --> Diet{Diet verified compatible?}
  Diet -- no --> Excluded
  Diet -- yes --> Ingredient{Known excluded ingredient/allergen?}
  Ingredient -- yes --> Excluded
  Ingredient -- no --> Disclosure{Strict allergen requested and absence not verified?}
  Disclosure -- yes --> Unknown[Unable to verify: no safe claim]
  Disclosure -- no --> Score[Score calorie, priority, completeness, diet fit]
  Score --> Stable[Stable sort by score, name, slug]
  Stable --> Results[Ranked suggestions with limitations]
```

## Figure 4. Admin mutation sequence

```mermaid
sequenceDiagram
  participant A as Administrator browser
  participant R as Next.js route
  participant O as Origin check
  participant S as Auth.js session
  participant Z as Zod
  participant P as Prisma/PostgreSQL
  A->>R: POST admin mutation
  R->>O: compare Origin to request URL
  O-->>R: allow or 403
  R->>S: require admin session
  S-->>R: allow or 401
  R->>Z: validate payload
  Z-->>R: typed data or 400
  R->>P: transaction: write entity + audit log
  P-->>R: 201 result
  R-->>A: safe response
```
