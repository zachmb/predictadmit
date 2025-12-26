// src/routes/api/ocr/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import Tesseract from 'tesseract.js';

const TMP_DIR = path.join(process.cwd(), 'tmp');

// Ensure tmp directory exists
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Dynamically import pdf-poppler at runtime
    let Poppler: any = null;
    if (process.platform !== 'linux') {
      // Only import Poppler on Windows/macOS
      const { createRequire } = await import('module');
      const require = createRequire(import.meta.url);
      Poppler = require('pdf-poppler');
    } else {
      console.warn('pdf-poppler is not supported on Linux. Skipping PDF→PNG conversion.');
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return new Response('No file uploaded', { status: 400 });
    }

    // Save PDF temporarily
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfFilename = `upload-${Date.now()}.pdf`;
    const pdfPath = path.join(TMP_DIR, pdfFilename);
    fs.writeFileSync(pdfPath, buffer);

    let imageFiles: string[] = [];

    if (Poppler) {
      const baseName = path.basename(pdfPath, '.pdf');

      const popplerOptions = {
        format: 'png',
        out_dir: TMP_DIR,
        out_prefix: baseName,
        page: null as number | null
      };

      // Convert PDF → PNG images
      await Poppler.convert(pdfPath, popplerOptions);

      // Collect PNG files
      imageFiles = fs
        .readdirSync(TMP_DIR)
        .filter((f) => f.startsWith(baseName) && f.endsWith('.png'))
        .sort()
        .map((f) => path.join(TMP_DIR, f));
    }

    let finalText = '';

    if (imageFiles.length > 0) {
      // OCR each page
      for (const imagePath of imageFiles) {
        const result = await (Tesseract as any).recognize(imagePath, 'eng', {
          logger: (m: any) => console.log(m)
        });
        finalText += ((result?.data?.text as string) || '') + '\n';

        try { fs.unlinkSync(imagePath); } catch {}
      }
    } else {
      console.warn('No PNG images generated, skipping OCR.');
    }

    // Clean up PDF
    try { fs.unlinkSync(pdfPath); } catch {}

    return new Response(JSON.stringify({ text: finalText.trim() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('OCR Error:', err);
    return new Response('OCR failed', { status: 500 });
  }
};
