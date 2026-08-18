import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';

async function createPdf(text) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([600, 400]);
  const helveticaFont = await doc.embedFont(StandardFonts.Helvetica);
  page.drawText(text, { x: 50, y: 350, size: 24, font: helveticaFont, color: rgb(0, 0, 0) });
  return await doc.save();
}

async function main() {
  console.log('Creating two sample PDFs...');
  const a = await createPdf('Sample PDF A - YourPDF test');
  const b = await createPdf('Sample PDF B - YourPDF test');

  fs.writeFileSync('sample-a.pdf', a);
  fs.writeFileSync('sample-b.pdf', b);

  console.log('Merging PDFs using pdf-lib...');
  const t0 = Date.now();

  const mergedPdf = await PDFDocument.create();
  const aDoc = await PDFDocument.load(a);
  const bDoc = await PDFDocument.load(b);

  const aPages = await mergedPdf.copyPages(aDoc, aDoc.getPageIndices());
  aPages.forEach((p) => mergedPdf.addPage(p));

  const bPages = await mergedPdf.copyPages(bDoc, bDoc.getPageIndices());
  bPages.forEach((p) => mergedPdf.addPage(p));

  const merged = await mergedPdf.save();
  const t1 = Date.now();

  fs.writeFileSync('merged-test.pdf', merged);

  console.log('Merged size (bytes):', merged.length);
  console.log('Time taken (ms):', t1 - t0);
  console.log('Sample files: sample-a.pdf, sample-b.pdf, merged-test.pdf');
}

main().catch((err) => { console.error(err); process.exit(1); });
