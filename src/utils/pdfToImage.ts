import * as pdfjsLib from 'pdfjs-dist';
import { saveAs } from 'file-saver';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// Helper to read file as ArrayBuffer
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// Convert PDF pages to JPG images
export const pdfToJpg = async (
  file: File,
  quality: number = 0.92,
  scale: number = 2,
  onProgress?: (current: number, total: number) => void
): Promise<void> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;

  for (let i = 1; i <= numPages; i++) {
    if (onProgress) onProgress(i, numPages);
    
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Type assertion for PDFPageProxy render method
    // pdfjs-dist has inconsistent TypeScript definitions across versions
    const renderTask = (page.render({
      canvasContext: context,
      viewport: viewport,
    }) as any).promise;
    await renderTask;

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality);
    });

    saveAs(blob, `page-${i}.jpg`);
  }
};

// Convert PDF pages to PNG images
export const pdfToPng = async (
  file: File,
  scale: number = 2,
  onProgress?: (current: number, total: number) => void
): Promise<void> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;

  for (let i = 1; i <= numPages; i++) {
    if (onProgress) onProgress(i, numPages);
    
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Type assertion for PDFPageProxy render method
    // pdfjs-dist has inconsistent TypeScript definitions across versions
    const renderTask = (page.render({
      canvasContext: context,
      viewport: viewport,
    }) as any).promise;
    await renderTask;

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/png');
    });

    saveAs(blob, `page-${i}.png`);
  }
};

// Get PDF page count
export const getPdfPageCount = async (file: File): Promise<number> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  return pdf.numPages;
};
