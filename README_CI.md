# CI and rate-limiter notes

This repository includes a lightweight GitHub Actions workflow to run the project's Vitest suite and notes about the Redis-backed rate limiter used by server routes.

## Redis & rate limiter

The code uses `REDIS_URL` to enable a Redis-backed rate limiter. When `REDIS_URL` is not set, the code falls back to a single-process in-memory Map. That fallback is fine for local development but is NOT safe for multi-instance production.

Optional environment variables:

- `REDIS_URL` (e.g. `redis://:password@host:6379/0`)
- `RATE_LIMIT_FAIL_CLOSED` (set to `true` to reject requests when Redis is misconfigured; by default the server falls back to memory)

## CI workflow

File: `.github/workflows/ci.yml` — it installs dependencies with `--legacy-peer-deps` (this repo uses dependencies that require that flag to avoid ERESOLVE) and runs `npm test`.

Tests in `tests/` mock the Firebase Admin SDK and therefore don't require real Firebase credentials. The workflow is intentionally simple; you can extend it to run linting, build, or integration tests.

## Run tests locally

```powershell
npm install --legacy-peer-deps
npm test
```
