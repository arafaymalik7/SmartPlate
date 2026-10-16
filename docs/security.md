# Security

SMARTPLATE validates user-controlled values with Zod before admin mutations, avoids raw SQL, keeps database URLs and secrets in ignored environment files, and does not accept file uploads. The protected admin routes enforce a server session check before their database imports, and the restaurant-create mutation writes an audit record in the same transaction.

The Prisma CLI, client, and PostgreSQL adapter are pinned together at the supported non-prerelease 7.10.1 release. On 2026-10-16, `npm audit --omit=dev` reported zero production dependency vulnerabilities after this update. This is a point-in-time package audit, not a substitute for ongoing dependency review.

Auth uses Auth.js credentials with an administrator-only bootstrap and scrypt password verification. Session cookies and CSRF protection use the maintained Auth.js/NextAuth defaults. Live invalid-login, logout, CSRF and authorized mutation checks remain unverified until a disposable PostgreSQL environment is available.

Every current admin mutation additionally compares an explicit browser `Origin` with the request URL before checking a session or importing the database client. Same-origin and non-browser requests are allowed; malformed or cross-origin browser requests are rejected with `403`. This is unit-tested.

Authenticated admin mutations have a tested in-process fixed-window limit of 20 writes per administrator email per minute and return `429` with `Retry-After` when the limit is reached. This provides a basic guard for the current single-process deployment shape; production multi-instance deployments must replace or augment it with a shared provider-aware rate-limit store. Live authenticated browser verification remains outstanding.

Nutrition and allergy information is informational only. Missing disclosure is unknown, never safe. Guest preferences are limited to non-sensitive meal controls and may be cleared locally.
