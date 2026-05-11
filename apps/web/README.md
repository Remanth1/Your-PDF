# Web App (`apps/web`)

This is a Next.js App Router scaffold for phased implementation.

Includes:

- SEO-ready tool landing pages via `app/[tool]/page.tsx`
- API stubs for job creation and status polling
- Sitemap generation

Run locally:

```bash
npm install
npm run dev
```

Next implementation steps:

- Connect `POST /api/jobs` to Redis/BullMQ
- Persist jobs in PostgreSQL
- Replace status stub with DB-backed progress
