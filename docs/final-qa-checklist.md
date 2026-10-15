# Final QA checklist

- [x] Lint, strict TypeScript, unit tests and production build pass locally.
- [ ] PostgreSQL migration from an empty non-production database.
- [ ] Seed twice and verify idempotency with real PostgreSQL.
- [ ] Bootstrap admin, sign in/out and test unauthorized admin API calls.
- [ ] Capture real browser screenshots at 375px, 768px and 1440px.
- [ ] Verify keyboard navigation, public links and browser console.
- [ ] Verify GitHub Actions run and pull request.
- [ ] Deploy to an approved Vercel/managed PostgreSQL environment and smoke-test public URL.
- [ ] Obtain genuine user testing and supervisor review; do not fabricate results.
