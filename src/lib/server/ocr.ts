// src/lib/server/ocr.ts
import { createWorker } from '@tesseract.js/node';
import type { Worker } from 'tesseract.js';
import { Buffer } from 'node:buffer';

let workerPromise: Promise<Worker> | null = null;

async function getWorker() {
  if (!workerPromise) {
    workerPromise = (async () => {
      const worker = await createWorker('eng');
      return worker;
    })();
  }
  return workerPromise;
}

// You’d still need to turn a PDF page into an image buffer before this.
// This is great for single-page images or per-page images.
export async function ocrImageBuffer(buf: Buffer): Promise<string> {
  const worker = await getWorker();
  const result = await worker.recognize(buf);
  const text = result.data?.text ?? '';
  return text.trim();
}
