# Testing strategy

## Test types

- Unit tests for converter adapters (mock filesystem & CLI)
- Integration tests for API endpoints (use test DB and local Redis)
- E2E tests for upload -> job -> download flow (Cypress / Playwright)
- Load tests for queue throughput (k6)
- Security tests: virus scan integration tests, rate-limit checks

## CI

- On PRs: run linter, unit tests, build frontend (no heavy converters), and run integration tests against ephemeral services via docker-compose
- Nightly: run E2E smoke tests and a small sample of large-file conversions on a staging worker
