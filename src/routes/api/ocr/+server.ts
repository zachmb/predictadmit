// src/routes/api/ocr/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import Tesseract from 'tesseract.js';

const require = createRequire(import.meta.url);
// pdf-poppler is CommonJS, so we still pull it in via require
const Poppler = require('pdf-poppler');

const TMP_DIR = path.join(process.cwd(), 'tmp');

// Ensure tmp directory exists
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      console.error('No file uploaded or wrong type:', file);
      return new Response('No file uploaded', { status: 400 });
    }

    // Convert uploaded PDF → Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save PDF temporarily
    const pdfFilename = `upload-${Date.now()}.pdf`;
    const pdfPath = path.join(TMP_DIR, pdfFilename);
    fs.writeFileSync(pdfPath, buffer);

    // Use ONLY the basename (no full path) as Poppler out_prefix
    const baseName = path.basename(pdfPath, '.pdf');

    const popplerOptions = {
      format: 'png',
      out_dir: TMP_DIR,
      out_prefix: baseName,
      page: null // all pages
    };

    // Convert PDF → PNG images
    await Poppler.convert(pdfPath, popplerOptions);

    // Collect the generated PNG image paths
    const imageFiles = fs
      .readdirSync(TMP_DIR)
      .filter((f) => f.startsWith(baseName) && f.endsWith('.png'))
      .sort() // keep pages in order
      .map((f) => path.join(TMP_DIR, f));

    if (imageFiles.length === 0) {
      console.error('No images produced from PDF by pdf-poppler');
      // Clean up pdf
      try {
        fs.unlinkSync(pdfPath);
      } catch (err) {
        console.warn('Failed to delete temp pdf:', pdfPath, err);
      }
      return new Response('Failed to render PDF pages for OCR', { status: 500 });
    }

    let finalText = '';

    // OCR each page
    for (const imagePath of imageFiles) {
      console.log('Running Tesseract on:', imagePath);

      const result = await (Tesseract as any).recognize(imagePath, 'eng', {
        logger: (m: any) => console.log(m)
      });

      finalText += ((result?.data?.text as string) || '') + '\n';

      // Delete PNG page after processing
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.warn('Failed to delete temp image:', imagePath, err);
      }
    }

    // Delete original PDF
    try {
      fs.unlinkSync(pdfPath);
    } catch (err) {
      console.warn('Failed to delete temp pdf:', pdfPath, err);
    }

    // Return OCR text
    return new Response(
      JSON.stringify({ text: finalText.trim() }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (err) {
    console.error('Tesseract OCR Error:', err);
    return new Response('OCR failed', { status: 500 });
  }
};
