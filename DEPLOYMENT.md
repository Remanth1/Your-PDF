# Deployment notes

## Frontend

- Deploy `apps/web` to Vercel using App Router.
- Build environment variables: `NEXT_PUBLIC_API_URL`, analytics keys.

## Workers

- Package `apps/worker` as Docker image.
- Run on Railway, Fly.io, ECS, or self-hosted VPS with autoscaling.
- Provide `REDIS_URL`, `DATABASE_URL`, `S3_ENDPOINT`, `S3_KEY`, `S3_SECRET`.

## Storage & CDN

- Use S3-compatible temporary buckets for intermediate file storage with lifecycle rules.
- Use Cloudflare CDN in front of frontend and for signed download links.

## Security

- Use short-lived signed URLs for uploads and downloads.
- Put virus-scanning step before enqueuing heavy tasks.
- Enforce rate-limits and file size limits on API gateway.

## Monitoring

- Use Prometheus + Grafana for queue metrics and latency.
- Centralized logs in Elastic/Cloudwatch/Datadog.
