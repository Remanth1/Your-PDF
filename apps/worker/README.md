# Worker app

## Purpose

Run conversion jobs pulled from BullMQ/Redis.

## Language

Node.js (TypeScript) or Python (FastAPI + RQ). This skeleton uses Node.js.

## Run locally (dev)

1. Start Redis
1. Build worker image and run

## Key files

- `src/worker.ts` — main loop
- `src/adapters/*` — converter wrappers (ffmpeg, libreoffice, imagemagick, tesseract)
- `Dockerfile`
