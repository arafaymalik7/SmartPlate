# Security

SMARTPLATE validates user-controlled values with Zod before admin mutations, avoids raw SQL, keeps database URLs and secrets in ignored environment files, and does not accept file uploads. The protected admin routes enforce a server session check before their database imports, and the restaurant-create mutation writes an audit record in the same transaction.

Auth uses Auth.js credentials with an administrator-only bootstrap and scrypt password verification. Session cookies and CSRF protection use the maintained Auth.js/NextAuth defaults; rate limiting is not yet implemented. Live invalid-login, logout, CSRF and authorized mutation checks remain unverified until a disposable PostgreSQL environment is available.

Nutrition and allergy information is informational only. Missing disclosure is unknown, never safe. Guest preferences are limited to non-sensitive meal controls and may be cleared locally.
