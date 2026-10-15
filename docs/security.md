# Security

SMARTPLATE validates user-controlled values server-side before future database mutations, avoids raw SQL, keeps database URLs and secrets in ignored environment files, and does not accept file uploads. Admin routes are not considered complete until maintained authentication, server-side authorization, a database-backed admin bootstrap, CSRF posture and unauthorized-route tests are implemented.

Nutrition and allergy information is informational only. Missing disclosure is unknown, never safe. Guest preferences are limited to non-sensitive meal controls and may be cleared locally.
