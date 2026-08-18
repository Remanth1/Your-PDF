const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');

const upload = multer({ storage: multer.memoryStorage() });
const app = express();
app.use(helmet());
app.use(cors());

const PORT = process.env.PORT || 3001;
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE) : 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'];

function validateFiles(files) {
  if (!files || files.length === 0) throw new Error('No files uploaded');
  for (const f of files) {
    if (f.size > MAX_FILE_SIZE) throw new Error(`File too large: ${f.originalname}`);
    if (!ALLOWED_TYPES.includes(f.mimetype)) throw new Error(`Invalid file type: ${f.originalname} (${f.mimetype})`);
  }
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/convert/images-to-pdf', upload.array('images', 50), async (req, res) => {
  try {
    const files = req.files;
    validateFiles(files);

    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      let imgBuffer = file.buffer;
      // Convert unsupported formats to PNG using sharp
      if (file.mimetype === 'image/webp' || file.mimetype === 'image/tiff') {
        imgBuffer = await sharp(imgBuffer).png().toBuffer();
      }

      // Try embedding as JPEG first
      let embeddedImage;
      try {
        if (file.mimetype === 'image/jpeg') {
          embeddedImage = await pdfDoc.embedJpg(imgBuffer);
        } else {
          embeddedImage = await pdfDoc.embedPng(imgBuffer);
        }
      } catch (err) {
        // Fallback: convert to PNG
        imgBuffer = await sharp(imgBuffer).png().toBuffer();
        embeddedImage = await pdfDoc.embedPng(imgBuffer);
      }

      const { width, height } = embeddedImage.scale(1);
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(embeddedImage, { x: 0, y: 0, width, height });
    }

    const pdfBytes = await pdfDoc.save();

    const fileName = `images-to-pdf-${Date.now()}.pdf`;
    const outputPath = path.join(__dirname, fileName);
    fs.writeFileSync(outputPath, pdfBytes);

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBytes);

    // Schedule deletion
    setTimeout(() => {
      try { fs.unlinkSync(outputPath); } catch (e) {}
    }, 1000 * 60 * 60 * 24); // delete after 24 hours

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`YourPDF API listening on port ${PORT}`);
});
