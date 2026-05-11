# File Format Converter — Architecture Overview

Goal: fast, privacy-first file conversion site with client-side conversions where feasible and backend workers for heavy tasks.

High-level components:

- `apps/web` — Next.js frontend (App Router), TypeScript, Tailwind, shadcn/ui, Framer Motion
- `apps/worker` — Worker processes (Node.js or Python) that run conversion tasks in Docker containers; connect to Redis/BullMQ
- `packages/ui` — shared React UI primitives for the frontend
- `packages/shared` — shared types, DTOs, and OpenAPI client
- `packages/converters` — adapters & example CLI wrappers for conversion engines
- `infra` — docker-compose, example Terraform/Kubernetes manifests (kept separate)

Runtime flow:

1. User uploads in browser (or uses drag-drop).

1. Frontend detects file type and validates desired conversion pair.

1. Frontend either performs conversion in-browser (e.g., JPG->PNG, small PDFs) or creates an authenticated Conversion Job via API.

1. API enqueues job in Redis (BullMQ) and returns job id + signed short-lived presigned upload URL when appropriate.

1. Worker fetches file (if uploaded to S3) or receives via streaming, executes converter adapter, writes output to temporary S3, updates DB and emits completion webhook.

1. API serves signed download link; files auto-expire.

Security & privacy:

- HTTPS-only; signed short-lived upload/download URLs
- Virus-scan hook integrated before enqueuing heavy jobs
- File size limits and rate-limiting at API gateway
- Auto-delete files after TTL (default 1 hour)

Scalability:

- Stateless web scaled on Vercel
- Workers scale horizontally; each worker runs conversions inside a constrained Docker container
- Redis + BullMQ handle job orchestration, with priority queues for premium users

Observability:

- Structured logging, job-trace ids
- Prometheus metrics + Grafana dashboards for job latency, failure rates, queue depth

MVP conversions (browser-first where possible):

- Browser: JPG->PNG, PNG->JPG, small image compression

- Worker: Word<->PDF (LibreOffice), PDF tools (qpdf/ghostscript), MP4->MP3 (ffmpeg), OCR (tesseract)
