# Operations and deployment runbook

Deployment is **not verified** in this repository because no hosting or managed
PostgreSQL credentials/public URL were supplied.

## Pre-production checklist

1. Create a managed PostgreSQL database and set `DATABASE_URL` for the runtime
   pool and `DIRECT_URL` for direct migrations. Do not use a production URL for
   local experiments.
2. Set a unique long `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL` to the final HTTPS
   origin, and bootstrap a real administrator only after the database exists.
3. Run `npm ci`, `npm run db:generate`, `npm run lint`, `npm run typecheck`,
   `npm test`, `npm run build`, and `npm run db:deploy` in the provider's
   controlled release path. Run `npm run db:seed` only for a deliberate demo
   environment; never seed production illustrative data by accident.
4. Confirm database backups and the provider's recovery point before a
   migration. A migration failure stops the release; do not force-reset or
   drop a populated database.

## Vercel-compatible release procedure

Next.js requires no custom Vercel configuration for this project. Connect the
repository, select the intended branch, add the environment variables above,
and deploy only after a database migration has completed successfully. Keep
`DIRECT_URL` available only to the controlled migration job when the provider
permits separate scopes; the running application uses `DATABASE_URL`.

After deployment, run:

```powershell
node scripts/verify-public-url.mjs https://your-smartplate.example
```

The script checks the public health payload, `robots.txt`, and `sitemap.xml`.
It is not a substitute for an authenticated administrator journey, database
integration test, accessibility review, or monitoring alert test.

## Monitoring, incident response, and rollback

Use hosting request/error logs and managed-database metrics/alerts for failed
requests, connection exhaustion, slow queries, and migration failures. Avoid
logging credentials, preferences, or full mutation payloads. The application
health route reports process availability only; it intentionally does not leak
database details.

For an application-only regression, roll back to the previous known-good
deployment in the hosting provider and smoke-test the public URL. For a schema
incident, stop further releases, restore from a verified backup or apply a
reviewed forward migration, then verify the public URL and authenticated admin
workflows. Never run destructive reset commands against a populated database.
