import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { pdfjs } from "./pdfjs-setup";

const MAX_PAGES = 20;

export async function ocrPdf(
  file: File,
  onProgress: (p: number) => void,
): Promise<Blob> {
  const { createWorker } = await import("tesseract.js");

  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: data.slice(0) }).promise;
  const pageCount = Math.min(pdf.numPages, MAX_PAGES);

  const worker = await createWorker("eng", undefined, {
    logger: (m) => {
      if (m.status === "recognizing text" && typeof m.progress === "number") {
        // reserve 0-15% for setup, 15-95% across pages
      }
    },
  });

  // Build a new PDF with original page (as image) + invisible text layer.
  const out = await PDFDocument.create();
  const font = await out.embedFont(StandardFonts.Helvetica);

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvas, canvasContext: ctx, viewport }).promise;

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    const jpgBytes = await (await fetch(dataUrl)).arrayBuffer();
    const img = await out.embedJpg(jpgBytes);

    const pageWidth = viewport.width / 2; // back to 1x points
    const pageHeight = viewport.height / 2;
    const newPage = out.addPage([pageWidth, pageHeight]);
    newPage.drawImage(img, { x: 0, y: 0, width: pageWidth, height: pageHeight });

    const { data: ocr } = await worker.recognize(canvas);
    const words = (ocr as unknown as { words?: Array<{ text: string; bbox: { x0: number; y0: number; x1: number; y1: number } }> }).words ?? [];
    const sx = pageWidth / canvas.width;
    const sy = pageHeight / canvas.height;
    for (const w of words) {
      if (!w.text.trim()) continue;
      const x = w.bbox.x0 * sx;
      const wpt = (w.bbox.x1 - w.bbox.x0) * sx;
      const hpt = (w.bbox.y1 - w.bbox.y0) * sy;
      const y = pageHeight - w.bbox.y1 * sy;
      const fontSize = Math.max(4, hpt * 0.9);
      newPage.drawText(w.text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        opacity: 0,
        maxWidth: wpt,
      });
    }

    onProgress(15 + (i / pageCount) * 80);
  }

  await worker.terminate();
  const bytes = await out.save();
  onProgress(100);
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}

export const OCR_MAX_PAGES = MAX_PAGES;
