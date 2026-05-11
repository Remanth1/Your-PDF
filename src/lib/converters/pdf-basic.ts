import { degrees, PDFDocument } from "pdf-lib";
import { pdfjs } from "./pdfjs-setup";

export async function mergePdfs(
  files: File[],
  onProgress: (p: number) => void,
): Promise<Blob> {
  const out = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    const bytes = await files[i].arrayBuffer();
    const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
    onProgress(((i + 1) / files.length) * 100);
  }
  const result = await out.save();
  return new Blob([result as BlobPart], { type: "application/pdf" });
}

export async function imagesToPdf(
  files: File[],
  onProgress: (p: number) => void,
): Promise<Blob> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const bytes = await f.arrayBuffer();
    const isPng = f.type.includes("png");
    const img = isPng
      ? await doc.embedPng(bytes)
      : await doc.embedJpg(bytes);
    const page = doc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    onProgress(((i + 1) / files.length) * 100);
  }
  const result = await doc.save();
  return new Blob([result as BlobPart], { type: "application/pdf" });
}

/**
 * "Compress" by re-saving with object streams + light image re-encoding via canvas.
 * pdf-lib doesn't truly recompress images, so we extract raster pages and re-render.
 * For an honest MVP we re-save with useObjectStreams which strips redundancy.
 */
export type CompressionPreset = "low" | "medium" | "high";

export async function compressPdf(
  file: File,
  onProgress: (p: number) => void,
  preset: CompressionPreset = "medium",
): Promise<Blob> {
  onProgress(5);
  const bytes = await file.arrayBuffer();

  // Map presets to render DPI and jpeg quality
  const presetMap: Record<CompressionPreset, { dpi: number; quality: number }> = {
    low: { dpi: 72, quality: 0.5 },
    medium: { dpi: 100, quality: 0.72 },
    high: { dpi: 150, quality: 0.9 },
  };

  const { dpi, quality } = presetMap[preset];

  const loadingTask = pdfjs.getDocument({ data: bytes });
  const pdf = await loadingTask.promise;
  const pageCount = pdf.numPages;

  const outDoc = await PDFDocument.create();

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1 });

    // compute scale from dpi (points per inch = 72)
    const scale = dpi / 72;
    const renderViewport = page.getViewport({ scale });

    // create canvas
    const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
    if (!canvas) throw new Error("Canvas unavailable in this environment");
    canvas.width = Math.ceil(renderViewport.width);
    canvas.height = Math.ceil(renderViewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");

    const renderContext = {
      canvasContext: ctx,
      viewport: renderViewport,
    } as any;

    await page.render(renderContext).promise;

    // convert canvas to jpeg blob
    const blob: Blob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b as Blob), "image/jpeg", quality);
    });

    const imgBytes = await blob.arrayBuffer();
    const embedded = await outDoc.embedJpg(imgBytes);
    const pageDims = [embedded.width, embedded.height];
    const outPage = outDoc.addPage(pageDims as [number, number]);
    outPage.drawImage(embedded, { x: 0, y: 0, width: pageDims[0], height: pageDims[1] });

    onProgress(Math.round(((i - 1) / pageCount) * 90) + 5);
  }

  const result = await outDoc.save({ useObjectStreams: true });
  onProgress(100);
  return new Blob([result as BlobPart], { type: "application/pdf" });
}

export async function splitPdf(
  file: File,
  fromPage: number,
  toPage: number,
  onProgress: (p: number) => void,
): Promise<Blob> {
  if (fromPage < 1 || toPage < fromPage) {
    throw new Error("Invalid page range");
  }

  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const pageCount = src.getPageCount();
  const start = Math.min(fromPage, pageCount);
  const end = Math.min(toPage, pageCount);

  if (start > pageCount) {
    throw new Error(`PDF has only ${pageCount} pages`);
  }

  const out = await PDFDocument.create();
  const indices = Array.from({ length: end - start + 1 }, (_, index) => start - 1 + index);
  const pages = await out.copyPages(src, indices);
  pages.forEach((page) => out.addPage(page));
  onProgress(80);
  const result = await out.save();
  onProgress(100);
  return new Blob([result as BlobPart], { type: "application/pdf" });
}

export interface SplitPdfChunk {
  filename: string;
  blob: Blob;
}

export async function splitPdfIntoChunks(
  file: File,
  pagesPerFile: number,
  onProgress: (p: number) => void,
): Promise<SplitPdfChunk[]> {
  if (!Number.isFinite(pagesPerFile) || pagesPerFile < 1) {
    throw new Error("Pages per file must be at least 1");
  }

  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const pageCount = src.getPageCount();
  const chunks: SplitPdfChunk[] = [];
  const baseName = file.name.replace(/\.pdf$/i, "");
  const chunkCount = Math.ceil(pageCount / pagesPerFile);

  for (let chunkIndex = 0; chunkIndex < chunkCount; chunkIndex++) {
    const startPage = chunkIndex * pagesPerFile + 1;
    const endPage = Math.min(startPage + pagesPerFile - 1, pageCount);
    const out = await PDFDocument.create();
    const indices = Array.from({ length: endPage - startPage + 1 }, (_, offset) => startPage - 1 + offset);
    const pages = await out.copyPages(src, indices);
    pages.forEach((page) => out.addPage(page));
    const result = await out.save();
    chunks.push({
      filename: `${baseName}-pages-${startPage}-${endPage}.pdf`,
      blob: new Blob([result as BlobPart], { type: "application/pdf" }),
    });
    onProgress(Math.round(((chunkIndex + 1) / chunkCount) * 100));
  }

  return chunks;
}

export async function rotatePdf(
  file: File,
  rotation: 90 | 180 | 270,
  onProgress: (p: number) => void,
): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const angle = degrees(rotation);

  doc.getPages().forEach((page) => {
    page.setRotation(angle);
  });

  onProgress(70);
  const out = await doc.save({ useObjectStreams: true, addDefaultPage: false });
  onProgress(100);
  return new Blob([out as BlobPart], { type: "application/pdf" });
}
