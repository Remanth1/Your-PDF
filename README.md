# YourPDF

## Summary

**YourPDF** is a free, browser-first document utility web app built with React 19 + TypeScript + Tailwind CSS 4, where all file processing happens client-side in JavaScript—no files ever get uploaded to a server.

---

## Tech Stack

- **Framework**: React 19 + TypeScript + Tailwind CSS 4, bundled with Vite 7 using `vite-plugin-singlefile` to inline everything into one deployable `dist/index.html`.
- **Libraries**: `pdf-lib`, `pdfjs-dist`, `jspdf` for PDFs; `docx`, `mammoth`, `xlsx`, `pptxgenjs` for document conversion; `tesseract.js` for OCR; `framer-motion` for animation.

## Application Shell & Routing

`App.tsx` manages global `darkMode` and `searchQuery` state, wraps everything in a `HashRouter`, and defines routes for the home page, dynamic tool pages (`/tools/:toolId`), and static pages (About, Contact, Privacy, Terms).

## Tool Registry (Data Layer)

`src/data/tools.ts` is the single source of truth defining all ~27 tools with `id`, `name`, `description`, `icon`, `category`, `badge`, and optional `limitations`. Categories include PDF, Document, Image, Data, and AI tools. It also holds the `faqs` array used by the `FAQ` component.

## Processing Engine

`ToolPage.tsx` reads `toolId` from the URL and dispatches to the matching utility function—e.g. `mergePDFs`, `compressPDF`, `pdfToWord`, `summarizePDF`, `ocrPDF`—via a large `switch` statement. AI summarization and chat, for example, use the Groq API (powered by `llama-3.3-70b-versatile`) with local context extraction implemented in `src/utils/aiTools.ts`.

## UI Component Library

Components live in `src/components/` and share a `darkMode` theming prop and `framer-motion` animations: `PageLayout`, `Header`, `Footer`, `Hero`, `ToolGrid`/`ToolCard`, `HowItWorks`, `Benefits`, `Testimonials`, `Pricing`, `FAQ`, `CTA`. Examples: `Hero.tsx`'s search bar and popular-tool chips, `HowItWorks.tsx`'s 3-step visualization, `Testimonials.tsx`'s stats/testimonial cards, and `FAQ.tsx`'s accordion.

## Static/Informational Pages

- `AboutPage.tsx` — mission, story, values.
- `PrivacyPage.tsx` — data collection/security policy.
- `sitemap.xml` lists all public routes including individual tool pages.

## Notes

- There's an `api/package.json` and `.env.example` referencing `VITE_API_URL`, which appears to be a separate backend/server-side experiment — it's not clearly wired into the main client-first architecture described in the README's "100% local processing" claim, so treat it as a possibly distinct/legacy subsystem rather than core to the privacy-first design.
- `PrivacyPage.tsx`'s claim about files being "transmitted using SSL" and "processed on secure servers" contradicts the README's "processing happens locally" claim — this is likely boilerplate/generic privacy-policy text rather than an accurate description of the actual architecture.