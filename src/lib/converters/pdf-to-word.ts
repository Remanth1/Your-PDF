import { Document, Packer, Paragraph, TextRun } from "docx";
import { pdfjs } from "./pdfjs-setup";

export async function pdfToDocx(
  file: File,
  onProgress: (p: number) => void,
): Promise<Blob> {
  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;
  const paragraphs: Paragraph[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    let lastY: number | null = null;
    let lineRuns: TextRun[] = [];

    const flushLine = () => {
      if (lineRuns.length) {
        paragraphs.push(new Paragraph({ children: lineRuns }));
        lineRuns = [];
      }
    };

    for (const item of textContent.items as Array<{ str: string; transform: number[] }>) {
      const y = item.transform[5];
      if (lastY !== null && Math.abs(y - lastY) > 2) flushLine();
      lineRuns.push(new TextRun({ text: item.str + " " }));
      lastY = y;
    }
    flushLine();

    if (i < pdf.numPages) {
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    }
    onProgress((i / pdf.numPages) * 100);
  }

  if (paragraphs.length === 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "No selectable text was found in this PDF. It may be a scan — try the OCR tool instead.",
          }),
        ],
      }),
    );
  }

  const doc = new Document({ sections: [{ children: paragraphs }] });
  const buf = await Packer.toBlob(doc);
  return buf;
}
