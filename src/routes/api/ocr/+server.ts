// src/routes/api/ocr/+server.ts
//
// Resume/CV text extraction. The previous implementation used pdf-poppler +
// tesseract.js, but poppler was explicitly skipped on Linux — so on Vercel
// (Linux serverless) it produced ZERO images and always returned empty text.
// OCR "worked" only on the developer's Mac.
//
// Virtually every resume is a text-based PDF (exported from Google Docs, Word,
// LaTeX, Canva, etc.), so we extract the embedded text layer with unpdf — a
// serverless-safe pdf.js build, no native binaries, works on Vercel.
// A genuinely scanned/image-only PDF has no text layer; we detect that and ask
// the user to paste their text instead of silently returning nothing.
//
// Every failure mode returns a distinct { error, code } so the client can say
// exactly what went wrong (sign in / not a PDF / password-locked / scanned)
// instead of one generic "didn't read cleanly".
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { guardAi } from '$lib/server/guard';

// PDF text extraction can run long on large files — lift the timeout (60s max).
export const config = { maxDuration: 60 };

// Vercel rejects request bodies over ~4.5MB before our code runs; anything close
// to that is refused here with a real message (the client pre-checks too).
const MAX_BYTES = 4 * 1024 * 1024;

export const POST: RequestHandler = async (event) => {
	const g = await guardAi(event);
	if (!g.ok) return g.response;
	const { request } = event;
	let file: FormDataEntryValue | null;
	try {
		const formData = await request.formData();
		file = formData.get('file');
	} catch {
		return json({ error: 'Invalid upload.', code: 'bad_upload' }, { status: 400 });
	}

	if (!file || !(file instanceof File)) {
		return json({ error: 'No file uploaded.', code: 'bad_upload' }, { status: 400 });
	}

	if (file.size > MAX_BYTES) {
		return json(
			{
				error: 'That PDF is over 4 MB. Export a smaller copy, or paste the text instead.',
				code: 'too_large'
			},
			{ status: 413 }
		);
	}

	let buffer: Buffer;
	try {
		buffer = Buffer.from(await file.arrayBuffer());
	} catch {
		return json(
			{ error: 'Could not read the uploaded file.', code: 'bad_upload' },
			{ status: 400 }
		);
	}

	// Real PDFs start with "%PDF" (possibly after a few junk bytes). A renamed
	// .docx/.png fails inside pdf.js with an opaque error — catch it up front.
	if (!buffer.subarray(0, 1024).includes('%PDF')) {
		return json(
			{
				error:
					'That file isn’t a PDF. Export your resume as a PDF and try again, or paste the text.',
				code: 'not_pdf'
			},
			{ status: 415 }
		);
	}

	try {
		// unpdf ships a serverless-safe build of pdf.js (no external font/cmap
		// assets to bundle), which is why it works on Vercel where plain pdf.js
		// throws at runtime.
		const { extractText, getDocumentProxy } = await import('unpdf');
		const doc = await getDocumentProxy(new Uint8Array(buffer));
		const { text: raw } = await extractText(doc, { mergePages: true });

		const text = (Array.isArray(raw) ? raw.join('\n') : (raw ?? ''))
			.replace(/\n{3,}/g, '\n\n')
			.trim();

		if (text.replace(/\s/g, '').length < 20) {
			// No meaningful text layer → scanned/image-only PDF.
			return json({
				text: '',
				scanned: true,
				code: 'scanned',
				message:
					'This PDF has no selectable text (it looks scanned or image-only). Paste your resume text below, or upload a text-based PDF exported from Google Docs, Word, or LaTeX.'
			});
		}

		return json({ text });
	} catch (err) {
		// pdf.js throws PasswordException (name survives bundling) on encrypted PDFs.
		if (err instanceof Error && err.name === 'PasswordException') {
			return json(
				{
					error:
						'That PDF is password-protected. Remove the password (print to PDF works) or paste the text instead.',
					code: 'password_protected'
				},
				{ status: 422 }
			);
		}
		if (err instanceof Error && err.name === 'InvalidPDFException') {
			return json(
				{
					error:
						'That PDF looks damaged. Re-export it (print to PDF works) or paste the text instead.',
					code: 'invalid_pdf'
				},
				{ status: 422 }
			);
		}
		console.error('OCR/parse error:', err);
		return json(
			{
				error: 'We couldn’t read that PDF. Try re-exporting it, or paste your text below.',
				code: 'parse_failed'
			},
			{ status: 500 }
		);
	}
};
