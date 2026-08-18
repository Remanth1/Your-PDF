# YourPDF

YourPDF is a fast, secure, and 100% free collection of browser-first file conversion and document utility tools. All file processing happens locally on your device using JavaScript—your files are never uploaded to any server.

## 🚀 Quick Start

Get the development environment running locally:

```bash
# Clone the repository
git clone https://github.com/Remanth1/Your-PDF.git
cd Your-PDF

# Install dependencies
npm install

# Run the local development server
npm run dev

# Build the project for production
npm run build
```

## ✨ Features

- **PDF Tools**: Merge, Split, Compress, Rotate, Watermark, and Add Page Numbers.
- **Image Tools**: PDF to JPG, JPG to PDF, Compress Image, Resize Image, Crop Image, and PNG to JPG.
- **Document Conversion**: PDF to Word, Word to PDF, PDF to Excel, Excel to PDF, HTML to PDF, PDF to PowerPoint, and PowerPoint to PDF.
- **AI PDF Tools**: Extractive Smart Summarize, semantic Search PDF, and OCR text extraction.
- **Privacy First**: Local file processing ensures zero document uploads or data leakage.
- **Responsive Design**: Polished dark/light modes with a mobile-friendly layout.

## 🛠️ Tech Stack

- **Framework**: React (v19) + TypeScript + Tailwind CSS (v4)
- **Bundler**: Vite (v7) with `vite-plugin-singlefile` (inlines all assets into a single deployable `dist/index.html` file)
- **PDF Libraries**: `pdf-lib`, `pdfjs-dist`, `jspdf`
- **Document Libraries**: `docx`, `mammoth`, `xlsx`, `pptxgenjs`
- **AI/OCR**: `tesseract.js`
- **Animation**: `framer-motion`