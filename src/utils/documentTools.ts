import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun, PageBreak } from 'docx';
import mammoth from 'mammoth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PptxGenJS from 'pptxgenjs';
import { saveAs } from 'file-saver';

// Set up PDF.js worker
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

// Helper to read file as text
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

// Extract text from PDF using pdf.js
const extractTextFromPDF = async (
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<string[]> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  const pages: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    if (onProgress) onProgress(i, numPages);
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    // Type assertion: pdfjs returns items with str property
    const pageText = (textContent.items as Array<{ str: string }>)
      .map((item) => item.str)
      .join(' ');
    pages.push(pageText);
  }

  return pages;
};

// PDF to Word conversion
export const pdfToWord = async (
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<void> => {
  const pages = await extractTextFromPDF(file, onProgress);
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: pages.flatMap((pageText, index) => {
        const paragraphs: (Paragraph)[] = [];
        
        // Split text into paragraphs
        const textParagraphs = pageText.split(/\n\n+/).filter(p => p.trim());
        
        textParagraphs.forEach(text => {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: text.trim(), size: 24 })],
              spacing: { after: 200 },
            })
          );
        });
        
        // Add page break except for last page
        if (index < pages.length - 1) {
          paragraphs.push(new Paragraph({ children: [new PageBreak()] }));
        }
        
        return paragraphs;
      }),
    }],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = file.name.replace(/\.[^/.]+$/, '');
  saveAs(blob, `${fileName}.docx`);
};

// Word to PDF conversion
export const wordToPdf = async (file: File): Promise<void> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = result.value;

  // Create a temporary div to render the HTML
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '210mm';
  container.style.padding = '20mm';
  container.style.backgroundColor = 'white';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.fontSize = '12pt';
  container.style.lineHeight = '1.5';
  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    
    // Handle multiple pages
    const pageHeight = pdfHeight * (imgWidth / pdfWidth);
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', imgX, position, imgWidth * ratio, imgHeight * ratio);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', imgX, position * ratio, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pageHeight;
    }

    const fileName = file.name.replace(/\.[^/.]+$/, '');
    pdf.save(`${fileName}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
};

// PDF to Excel - Extract tables
export const pdfToExcel = async (
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<void> => {
  const pages = await extractTextFromPDF(file, onProgress);
  
  // Try to detect table-like structures
  const rows: string[][] = [];
  
  pages.forEach(pageText => {
    const lines = pageText.split(/\n/).filter(l => l.trim());
    lines.forEach(line => {
      // Split by multiple spaces or tabs (common in PDF tables)
      const cells = line.split(/\s{2,}|\t/).filter(c => c.trim());
      if (cells.length > 0) {
        rows.push(cells);
      }
    });
  });

  // Create Excel file using xlsx
  const XLSX = await import('xlsx');
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  const fileName = file.name.replace(/\.[^/.]+$/, '');
  saveAs(blob, `${fileName}.xlsx`);
};

// Excel to PDF
export const excelToPdf = async (file: File): Promise<void> => {
  const XLSX = await import('xlsx');
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const html = XLSX.utils.sheet_to_html(firstSheet);

  // Create styled container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '280mm';
  container.style.padding = '10mm';
  container.style.backgroundColor = 'white';
  container.innerHTML = `
    <style>
      table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 10pt; }
      td, th { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
      th { background-color: #f5f5f5; font-weight: bold; }
      tr:nth-child(even) { background-color: #fafafa; }
    </style>
    ${html}
  `;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape for tables
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = pdfWidth / imgWidth;
    
    let heightLeft = imgHeight * ratio;
    let position = 0;
    
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight * ratio);
    heightLeft -= pdfHeight;
    
    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight * ratio);
      heightLeft -= pdfHeight;
    }

    const fileName = file.name.replace(/\.[^/.]+$/, '');
    pdf.save(`${fileName}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
};

// PDF to PowerPoint
export const pdfToPowerPoint = async (
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<void> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';

  for (let i = 1; i <= numPages; i++) {
    if (onProgress) onProgress(i, numPages);
    
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // @ts-ignore
    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    const imgData = canvas.toDataURL('image/jpeg', 0.9);
    
    const slide = pptx.addSlide();
    slide.addImage({
      data: imgData,
      x: 0,
      y: 0,
      w: '100%',
      h: '100%',
      sizing: { type: 'contain', w: '100%', h: '100%' }
    });
  }

  const fileName = file.name.replace(/\.[^/.]+$/, '');
  await pptx.writeFile({ fileName: `${fileName}.pptx` });
};

// PowerPoint to PDF
export const powerPointToPdf = async (
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<void> => {
  const JSZip = (await import('jszip')).default;
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const zip = await JSZip.loadAsync(arrayBuffer);
  
  // Find slide images or render slides
  const slideFiles = Object.keys(zip.files)
    .filter(name => name.startsWith('ppt/slides/slide') && name.endsWith('.xml'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)/)?.[1] || '0');
      const numB = parseInt(b.match(/slide(\d+)/)?.[1] || '0');
      return numA - numB;
    });

  const pdf = new jsPDF('l', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  // Extract slide content and render
  for (let i = 0; i < slideFiles.length; i++) {
    if (onProgress) onProgress(i + 1, slideFiles.length);
    
    const slideXml = await zip.file(slideFiles[i])?.async('text');
    if (!slideXml) continue;

    // Parse slide content
    const parser = new DOMParser();
    const doc = parser.parseFromString(slideXml, 'text/xml');
    
    // Extract text content
    const textElements = doc.querySelectorAll('a\\:t, t');
    const texts: string[] = [];
    textElements.forEach(el => {
      if (el.textContent) texts.push(el.textContent);
    });

    // Create slide image
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d')!;
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Render text
    ctx.fillStyle = '#333333';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    
    let yPos = 100;
    texts.forEach((text, idx) => {
      if (idx === 0) {
        ctx.font = 'bold 48px Arial';
        ctx.fillText(text, canvas.width / 2, yPos);
        yPos += 80;
        ctx.font = '32px Arial';
      } else {
        const lines = wrapText(ctx, text, canvas.width - 200);
        lines.forEach(line => {
          ctx.fillText(line, canvas.width / 2, yPos);
          yPos += 45;
        });
      }
    });

    // Add slide number
    ctx.font = '24px Arial';
    ctx.fillStyle = '#999999';
    ctx.fillText(`Slide ${i + 1}`, canvas.width / 2, canvas.height - 50);

    const imgData = canvas.toDataURL('image/jpeg', 0.9);
    
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  }

  const fileName = file.name.replace(/\.[^/.]+$/, '');
  pdf.save(`${fileName}.pdf`);
};

// Helper to wrap text
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  
  if (currentLine) lines.push(currentLine);
  return lines;
}

// HTML to PDF
export const htmlToPdf = async (file: File): Promise<void> => {
  const html = await readFileAsText(file);
  
  // Create container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '210mm';
  container.style.padding = '15mm';
  container.style.backgroundColor = 'white';
  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = pdfWidth / imgWidth;
    
    let heightLeft = imgHeight * ratio;
    let position = 0;
    
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight * ratio);
    heightLeft -= pdfHeight;
    
    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight * ratio);
      heightLeft -= pdfHeight;
    }

    const fileName = file.name.replace(/\.[^/.]+$/, '');
    pdf.save(`${fileName}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
};
