import { PDFDocument } from "pdf-lib";

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
export async function compressPdf(
  file: File,
  onProgress: (p: number) => void,
): Promise<Blob> {
  onProgress(20);
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  onProgress(60);
  const out = await doc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });
  onProgress(100);
  return new Blob([out as BlobPart], { type: "application/pdf" });
}
