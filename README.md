# File Format Converter — Monorepo

This repository contains the scaffold for a production-grade file conversion service.

## Structure

- `/apps/web` — Next.js frontend (not implemented here; this repo already contains a working frontend in the root `src/`)
- `/apps/worker` — Worker that processes conversion jobs
- `/packages/converters` — Converter interfaces and adapters
- `/db/schema.sql` — PostgreSQL schema

## Quickstart (dev)

1. Start infra:

```bash
docker compose up -d redis postgres
```

1. Run worker (from repo root):

```bash
cd apps/worker
# build or run with ts-node for dev
node dist/worker.js # or `ts-node src/worker.ts`
```

1. Frontend (existing app):

```bash
npm install
npm run dev
```

Notes: This scaffold is non-invasive — it does not modify your existing frontend app. It adds a monorepo layout and starter files for workers and converters.
