# Project Plan — File Format Converter (MVP)

Priority MVP features:

- PDF <-> Word
- JPG <-> PNG
- MP4 -> MP3
- PDF Merge, Split, Compress

Phase 1 — Foundation

1. Scaffold monorepo structure
1. Define API contracts (OpenAPI)
1. Worker skeleton + queue integration
1. Basic converters (image, ffmpeg wrapper, libreoffice wrapper)
1. Frontend skeleton with routes & SEO templates
1. Docker dev-compose and deployment notes

Phase 2 — Implement MVP converters & UI

1. Implement converters, attach to worker queue
1. Add frontend upload, job creation, progress polling
1. Implement auto-delete + signed URLs
1. Add user tiers/basic auth (payments removed)

Phase 3 — Hardening & scale

1. Observe failure modes, add retries/timeouts
1. Add virus scanning hook
1. Add monitoring, alerts
1. Monetization: ads + premium queue

Deliverables

- Architecture doc
- Folder scaffold
- OpenAPI spec
- DB schema
- Worker + adapters
- Frontend pages + SEO templates
- Docker + deployment guide

Notes

- Keep converters modular behind a shared interface: `convert(inputPath, outputPath, options)`
- Prefer streaming and avoiding reads into memory for large files
