# YourPDF 📄✨

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**YourPDF** is a highly optimized, client-side document utility web application. It packages a wide collection of file-conversion, image-manipulation, data-format transformation, and AI-assisted workflows into a single interface. 

All core operations occur **directly in the user's browser** via local JavaScript execution. No files are ever uploaded or transmitted to external processing servers, guaranteeing absolute data privacy.

---

## 🚀 Quick Start

Get the local development server up and running:

```bash
# Clone the repository
git clone https://github.com/Remanth1/Your-PDF.git
cd Your-PDF

# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production (single-file distribution)
npm run build
```

---

## 🛠️ Tech Stack

*   **Core UI**: React 19 + TypeScript + Tailwind CSS 4
*   **Build Pipeline**: Vite 7 + `vite-plugin-singlefile` (inlines all CSS/JS assets directly into a single deployable `dist/index.html` file)
*   **Libraries**:
    *   **PDF Manipulation**: `pdf-lib`, `pdfjs-dist`, `jspdf`
    *   **Document Conversion**: `docx`, `mammoth`, `xlsx`, `pptxgenjs`
    *   **Optical Character Recognition (OCR)**: `tesseract.js`
    *   **Animation**: `framer-motion`
    *   **Icons**: `lucide-react`

---

## ⚙️ Architecture & Data Layer

### 1. Application Shell & Routing (`App.tsx`)
Global state for `darkMode` and `searchQuery` is managed at the root level. Routing is handled via `HashRouter` (allowing easy static hosting without needing server rewrite rules) serving:
*   `HomePage.tsx` — Dashboard view with tools grid.
*   `ToolPage.tsx` — The interactive workspace.
*   Static informational pages (`AboutPage.tsx`, `ContactPage.tsx`, `PrivacyPage.tsx`, `TermsPage.tsx`).

### 2. Tool Registry (`src/data/tools.ts`)
Serves as the single source of truth defining all ~27 tool entries (`id`, `name`, `description`, `icon`, `category`, `badge`, `limitations`) and the structured content for the accordion-based FAQ component.

### 3. Processing Engine (`ToolPage.tsx`)
Listens to the active `:toolId` route parameter and dispatches files to their matching helper functions using a routing `switch` statement:
*   **PDF operations**: `mergePDFs`, `compressPDF`, `rotatePDF`, `addPageNumbers`, `addWatermark`
*   **Image operations**: `compressImage`, `resizeImage`, `cropImage`, `pdfToJpg`
*   **Data operations**: `csvToExcel`, `excelToCsv`, `json-to-csv`, `xmlToJson`
*   **AI/OCR workflows**: `summarizePDF`, `chatWithPDF`, `ocrPDF`

---

## 🤖 AI Features (Groq API Integration)

AI summaries and document chat features are powered by the **Groq API** (using the fast `llama-3.1-8b-instant` model) via direct browser fetch requests. 

*   **Setup**: Configure your key in a `.env` file at the root level:
    ```env
    VITE_GROQ_API_KEY=your_groq_api_key_here
    ```
*   **Execution**: Text is extracted locally using `pdfjs-dist`, key context is matched, and context-bound prompts are sent directly to Groq.

---

## 📂 Project Structure

```text
.
├── .env.example            # Sample configuration template
├── index.html              # Vite HTML entry point and SEO metatags
├── vite.config.ts          # Vite asset pipeline configuration
├── sitemap.xml             # XML sitemap for dynamic tool routes
├── robots.txt              # Crawler instructions
├── src/
│   ├── App.tsx             # Main shell & client routing
│   ├── main.tsx            # React entry point
│   ├── components/         # Reusable UI components (Header, Footer, Hero, ToolGrid)
│   ├── data/               # Static datasets and tool definitions (tools.ts)
│   ├── pages/              # Main route views (HomePage, ToolPage, AboutPage)
│   └── utils/              # Client-side core conversion utility helpers
└── api/                    # Isolated backend/server-side code (Distinct experiment)
```

---

## 📝 Developer Notes

*   **The `api/` Directory**: An isolated `api/` directory (Node.js/Express service) and references to `VITE_API_URL` exist in `.env.example`. This represents a separate backend prototype and is not coupled to the main browser-first architecture.
*   **Boilerplate Notice**: Some texts in `PrivacyPage.tsx` referencing file transmission to "secure servers" and "SSL encryption" represent generic template wording. All file processing in YourPDF is strictly client-side and runs 100% locally.