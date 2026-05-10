## Goal

Build a privacy-first, browser-only file conversion app. All processing happens client-side — files never leave the user's device. Six tools at launch, each with its own SEO-friendly route.

## Architecture

- **TanStack Start** (existing stack), client-only conversion. No backend, no storage, no Lovable Cloud.
- Each tool is a route under `src/routes/` with its own `head()` metadata for SEO.
- Conversion logic lives in `src/lib/converters/` and is loaded **dynamically** (`await import(...)`) so heavy WASM (Tesseract ~10MB, mupdf, etc.) only ships when a user opens that tool.
- Shared upload UI: dropzone, file list, progress, download — built once, reused per tool.

## Routes

```
/                  Landing (hero + tool grid + privacy promise)
/pdf-to-word       PDF → DOCX
/word-to-pdf       DOCX → PDF
/jpg-to-pdf        Images → PDF
/merge-pdf         Multiple PDFs → one PDF
/compress-pdf      PDF → smaller PDF
/ocr-pdf           Scanned PDF → searchable PDF
/privacy           Privacy policy
/terms             Terms of service
```

Each tool route follows the same shell: hero (H1 + value prop) → uploader → "How it works" → FAQ. SEO meta unique per route.

## Conversion library choices (browser-only)

| Tool | Library | Notes |
|---|---|---|
| Merge PDF | `pdf-lib` | Trivial, fast |
| JPG → PDF | `pdf-lib` | Embed images, auto page size |
| Compress PDF | `pdf-lib` + image re-encode via Canvas | Re-sample embedded images; honest "light compression" |
| PDF → Word | `pdfjs-dist` (text + layout) → `docx` | Text-layer extraction; image-only PDFs produce empty docs (warn user, suggest OCR) |
| Word → PDF | `mammoth` (DOCX → HTML) → `html2pdf.js`/`jspdf` + `html2canvas` | Good for text docs; complex layouts will reflow (disclosed) |
| OCR PDF | `tesseract.js` + `pdfjs-dist` to rasterize → `pdf-lib` to write text layer | English by default; allow language selection later. Page-count cap (e.g. 20) to keep UX reasonable |

All of these are pure JS/WASM that work in the browser. No server, no Worker runtime issues.

## Job/state model (client-side)

A small `useConversionJob` hook per tool: `idle → reading → processing(progress%) → done(blobUrl) → error`. Uses a Web Worker (`new Worker(new URL(...), { type: 'module' })`) for heavy converters (OCR, Word→PDF) so the UI stays responsive. Object URLs are revoked on unmount.

## UI/UX

- shadcn/ui components (already installed): Button, Card, Progress, Alert, Tabs, Accordion (FAQ).
- React Dropzone for upload.
- Honest empty/error states ("This PDF is image-only — try OCR PDF instead").
- Mobile-responsive, keyboard accessible.
- Clear "Files never leave your browser" badge on every tool.

## Design system

Modern, trustworthy SaaS feel. Add to `src/styles.css`:
- Primary (calm blue/indigo), accent, success, destructive — all in oklch.
- Soft surface tokens for cards, subtle gradient on hero.
- Dark mode support via existing `.dark` block.

## Analytics & Ads

Out of scope for this build (no accounts/keys yet). Leave clean placeholders in `__root.tsx` head and a `<AdSlot />` component returning `null` so they're easy to wire up later.

## Non-goals (this build)

- No queue, Redis, S3, workers-as-a-service.
- No accounts, no rate limiting (not meaningful client-side).
- No virus scanning.
- No batch UI beyond what merge needs.

## Build order

1. **Foundation**: design tokens in `styles.css`, shared layout (header w/ nav + footer w/ privacy/terms links) in `__root.tsx`, landing page with tool grid.
2. **Shared upload component** + `useConversionJob` hook + Web Worker scaffold.
3. **Tools in this order** (easiest → hardest, ship value fast):
   1. Merge PDF
   2. JPG → PDF
   3. Compress PDF
   4. Word → PDF
   5. PDF → Word
   6. OCR PDF
4. **SEO content** (FAQ + how-it-works) per tool route.
5. **Legal pages**: `/privacy`, `/terms`.

## Technical details

- Dependencies to add: `pdf-lib`, `pdfjs-dist`, `docx`, `mammoth`, `jspdf`, `html2canvas`, `tesseract.js`, `react-dropzone`.
- `pdfjs-dist` worker: serve from `public/` and configure `GlobalWorkerOptions.workerSrc` to a same-origin URL.
- `tesseract.js`: load language data from CDN (configurable) on first OCR run; show download progress.
- All converter modules are client-only — never imported from route loaders or server functions.
- File-size guard: warn above 100 MB; hard-block above 250 MB to protect the tab.
- Use `URL.createObjectURL` for downloads; revoke on cleanup.
- Each tool route sets unique `title`, `description`, `og:title`, `og:description` in `head()`.

## Out-of-scope / future

Word↔PDF fidelity for complex layouts, multi-language OCR, batch jobs, accounts, premium tier, API. Spec's worker/Redis/S3 architecture is deliberately deferred until the privacy promise is revisited.
