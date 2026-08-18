import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

// Helper to read file as ArrayBuffer
export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// Helper to read file as Data URL
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper to create blob from pdf bytes
const createPdfBlob = (pdfBytes: Uint8Array): Blob => {
  // Create a new ArrayBuffer copy to avoid SharedArrayBuffer issues
  const buffer = new ArrayBuffer(pdfBytes.length);
  const view = new Uint8Array(buffer);
  view.set(pdfBytes);
  return new Blob([buffer], { type: 'application/pdf' });
};

// Merge multiple PDFs
export const mergePDFs = async (files: File[]): Promise<void> => {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  
  const mergedPdfBytes = await mergedPdf.save();
  const blob = createPdfBlob(mergedPdfBytes);
  saveAs(blob, 'merged.pdf');
};

// Split PDF into individual pages
export const splitPDF = async (file: File): Promise<void> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pageCount = pdf.getPageCount();
  
  for (let i = 0; i < pageCount; i++) {
    const newPdf = await PDFDocument.create();
    const [page] = await newPdf.copyPages(pdf, [i]);
    newPdf.addPage(page);
    const pdfBytes = await newPdf.save();
    const blob = createPdfBlob(pdfBytes);
    saveAs(blob, `page-${i + 1}.pdf`);
  }
};

// Split PDF by page range
export const splitPDFByRange = async (file: File, startPage: number, endPage: number): Promise<void> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pageCount = pdf.getPageCount();
  
  const start = Math.max(0, startPage - 1);
  const end = Math.min(pageCount - 1, endPage - 1);
  
  const newPdf = await PDFDocument.create();
  const pageIndices = [];
  for (let i = start; i <= end; i++) {
    pageIndices.push(i);
  }
  
  const pages = await newPdf.copyPages(pdf, pageIndices);
  pages.forEach((page) => newPdf.addPage(page));
  
  const pdfBytes = await newPdf.save();
  const blob = createPdfBlob(pdfBytes);
  saveAs(blob, `pages-${startPage}-to-${endPage}.pdf`);
};

// Rotate PDF pages
export const rotatePDF = async (file: File, rotation: number): Promise<void> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();
  
  pages.forEach((page) => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + rotation));
  });
  
  const pdfBytes = await pdf.save();
  const blob = createPdfBlob(pdfBytes);
  saveAs(blob, 'rotated.pdf');
};

// Compress PDF (basic compression by removing metadata)
export const compressPDF = async (file: File): Promise<{ originalSize: number; compressedSize: number }> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  
  // Remove metadata for smaller size
  pdf.setTitle('');
  pdf.setAuthor('');
  pdf.setSubject('');
  pdf.setKeywords([]);
  pdf.setProducer('');
  pdf.setCreator('');
  
  const pdfBytes = await pdf.save({
    useObjectStreams: true,
  });
  
  const blob = createPdfBlob(pdfBytes);
  const originalSize = file.size;
  const compressedSize = blob.size;
  
  saveAs(blob, 'compressed.pdf');
  return { originalSize, compressedSize };
};

// Add page numbers to PDF
export const addPageNumbers = async (
  file: File, 
  position: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left' = 'bottom-center'
): Promise<void> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const totalPages = pages.length;
  
  pages.forEach((page, index) => {
    const { width, height } = page.getSize();
    const text = `${index + 1} / ${totalPages}`;
    const textWidth = font.widthOfTextAtSize(text, 12);
    
    let x: number;
    let y: number;
    
    switch (position) {
      case 'bottom-left':
        x = 40;
        y = 30;
        break;
      case 'bottom-right':
        x = width - textWidth - 40;
        y = 30;
        break;
      case 'top-left':
        x = 40;
        y = height - 30;
        break;
      case 'top-right':
        x = width - textWidth - 40;
        y = height - 30;
        break;
      case 'top-center':
        x = (width - textWidth) / 2;
        y = height - 30;
        break;
      case 'bottom-center':
      default:
        x = (width - textWidth) / 2;
        y = 30;
        break;
    }
    
    page.drawText(text, {
      x,
      y,
      size: 12,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });
  });
  
  const pdfBytes = await pdf.save();
  const blob = createPdfBlob(pdfBytes);
  saveAs(blob, 'numbered.pdf');
};

// Add watermark to PDF
export const addWatermark = async (file: File, watermarkText: string): Promise<void> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  
  pages.forEach((page) => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(watermarkText, 60);
    
    page.drawText(watermarkText, {
      x: (width - textWidth) / 2,
      y: height / 2,
      size: 60,
      font,
      color: rgb(0.75, 0.75, 0.75),
      opacity: 0.3,
      rotate: degrees(-45),
    });
  });
  
  const pdfBytes = await pdf.save();
  const blob = createPdfBlob(pdfBytes);
  saveAs(blob, 'watermarked.pdf');
};

// Convert images to PDF
export const imagesToPDF = async (files: File[]): Promise<void> => {
  const pdf = await PDFDocument.create();
  
  for (const file of files) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const uint8Array = new Uint8Array(arrayBuffer);
    
    let image;
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      image = await pdf.embedJpg(uint8Array);
    } else if (file.type === 'image/png') {
      image = await pdf.embedPng(uint8Array);
    } else {
      // Convert other formats to PNG using canvas
      const dataUrl = await readFileAsDataURL(file);
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = dataUrl;
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      
      const pngDataUrl = canvas.toDataURL('image/png');
      const pngData = atob(pngDataUrl.split(',')[1]);
      const pngArray = new Uint8Array(pngData.length);
      for (let i = 0; i < pngData.length; i++) {
        pngArray[i] = pngData.charCodeAt(i);
      }
      image = await pdf.embedPng(pngArray);
    }
    
    const page = pdf.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }
  
  const pdfBytes = await pdf.save();
  const blob = createPdfBlob(pdfBytes);
  saveAs(blob, 'images.pdf');
};

// Get PDF info
export const getPDFInfo = async (file: File): Promise<{
  pageCount: number;
  title: string | undefined;
  author: string | undefined;
}> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  
  return {
    pageCount: pdf.getPageCount(),
    title: pdf.getTitle(),
    author: pdf.getAuthor(),
  };
};

// Unlock PDF (try to load without password protection)
export const unlockPDF = async (file: File): Promise<void> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  
  const pdfBytes = await pdf.save();
  const blob = createPdfBlob(pdfBytes);
  saveAs(blob, 'unlocked.pdf');
};
