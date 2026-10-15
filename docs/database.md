# Database

SMARTPLATE uses PostgreSQL with Prisma 7 and the `@prisma/adapter-pg` driver adapter. The schema models restaurants, categorized menu items, nullable per-serving nutrition, provenance, explicit ingredient/allergen disclosure states, administrators, sessions and audit records.

`PRESENT`, `ABSENT_VERIFIED`, and `UNKNOWN` are distinct disclosure states. Absence of a join row is not evidence that an ingredient or allergen is absent. Nutrient columns are nullable to preserve unknown values.

Set `DATABASE_URL` for runtime and `DIRECT_URL` for Prisma migrations. Never use a production URL for local tests. Run `npm run db:generate`, then `npm run db:migrate` only against an approved local/development database.
