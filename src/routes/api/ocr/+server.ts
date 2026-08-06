// src/routes/api/ocr/+server.ts
//
// Resume/CV text extraction. The previous implementation used pdf-poppler +
// tesseract.js, but poppler was explicitly skipped on Linux — so on Vercel
// (Linux serverless) it produced ZERO images and always returned empty text.
// OCR "worked" only on the developer's Mac.
//
// Virtually every resume is a text-based PDF (exported from Google Docs, Word,
// LaTeX, Canva, etc.), so we extract the embedded text layer with pdf-parse —
// pure JS (pdf.js under the hood), no native binaries, works on serverless.
// A genuinely scanned/image-only PDF has no text layer; we detect that and ask
// the user to paste their text instead of silently returning nothing.
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	let file: FormDataEntryValue | null;
	try {
		const formData = await request.formData();
		file = formData.get('file');
	} catch {
		return json({ error: 'Invalid upload.' }, { status: 400 });
	}

	if (!file || !(file instanceof File)) {
		return json({ error: 'No file uploaded.' }, { status: 400 });
	}

	let buffer: Buffer;
	try {
		buffer = Buffer.from(await file.arrayBuffer());
	} catch {
		return json({ error: 'Could not read the uploaded file.' }, { status: 400 });
	}

	try {
		// Dynamic import keeps pdf.js out of the main server bundle.
		const { PDFParse } = await import('pdf-parse');
		const parser = new PDFParse({ data: new Uint8Array(buffer) });

		let text = '';
		try {
			const res = await parser.getText();
			text = (res?.text ?? '').trim();
		} finally {
			// Release the pdf.js worker/document.
			await (parser as { destroy?: () => Promise<void> }).destroy?.().catch(() => {});
		}

		// pdf-parse injects "-- N of M --" page separators; strip them.
		text = text
			.replace(/\n?--\s*\d+\s+of\s+\d+\s*--\n?/gi, '\n')
			.replace(/\n{3,}/g, '\n\n')
			.trim();

		if (text.replace(/\s/g, '').length < 20) {
			// No meaningful text layer → scanned/image-only or locked PDF.
			return json({
				text: '',
				scanned: true,
				message:
					'This PDF has no selectable text (it looks scanned or image-only). Paste your resume text below, or upload a text-based PDF exported from Google Docs, Word, or LaTeX.'
			});
		}

		return json({ text });
	} catch (err) {
		console.error('OCR/parse error:', err);
		return json(
			{ error: 'Could not read this PDF. Please paste your resume text instead.' },
			{ status: 500 }
		);
	}
};
