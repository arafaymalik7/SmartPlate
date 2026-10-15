# Final QA checklist

- [x] Lint, strict TypeScript, unit tests and production build pass locally.
- [x] CI PostgreSQL migration and seed against an ephemeral empty PostgreSQL 16 service.
- [ ] Seed twice and verify idempotency with a real PostgreSQL service.
- [ ] Bootstrap admin, sign in/out and test unauthorized admin API calls.
- [x] Capture and inspect real public-browser screenshots at 375px, 768px and 1440px.
- [x] Verify public keyboard skip navigation, routes, metadata and responsive browser journeys.
- [x] Verify GitHub Actions CI run #20 through the public workflow feed.
- [ ] Deploy to an approved Vercel/managed PostgreSQL environment and smoke-test public URL.
- [ ] Obtain genuine user testing and supervisor review; do not fabricate results.
