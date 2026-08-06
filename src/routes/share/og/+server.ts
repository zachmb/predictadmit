// src/routes/share/og/+server.ts
//
// Dynamic, PERSONALIZED Open Graph image for shared decision links.
//
// Every share link (/share?school=…&outcome=…&name=…) now points its og:image
// here, so when someone drops the link in iMessage, Slack, Discord, Instagram
// DMs or X, the unfurled card shows *their* name + school in the school's own
// brand color — not one generic house image. Personalized preview cards are the
// single biggest lever on share-through rate, which is the growth loop for the
// portal simulator.
//
// Rendered with @vercel/og (satori + resvg, bundled default font + emoji), so it
// runs on Vercel's serverless Node runtime with no external font fetch to fail.
import { ImageResponse } from '@vercel/og';
import type { RequestHandler } from './$types';
import { schoolConfigs } from '$lib/config/schools';
import { schoolStats } from '$lib/config/schoolStats';

// Mirror /share's name sanitization exactly so the card and the page agree.
function sanitizeName(raw: string | null): string {
	if (!raw) return 'A PredictAdmit user';
	const cleaned = raw
		.replace(/[^\p{L}\s'-]/gu, '')
		.trim()
		.slice(0, 40);
	return cleaned.length ? cleaned : 'A PredictAdmit user';
}

// A plain-object element tree — satori accepts this React-element shape, so we
// avoid pulling JSX/React into a .ts endpoint.
type El = { type: string; props: { style?: Record<string, unknown>; children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown): El => ({
	type,
	props: { style, children }
});

// Pick readable text (white vs near-black) for a given hex background.
function readableOn(hex: string): string {
	const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
	if (!m) return '#ffffff';
	const n = parseInt(m[1], 16);
	const r = (n >> 16) & 255,
		g = (n >> 8) & 255,
		b = n & 255;
	// Perceived luminance (sRGB, rough) → dark bg gets white text and vice-versa.
	const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return lum > 0.62 ? '#0f172a' : '#ffffff';
}

export const GET: RequestHandler = async ({ url }) => {
	const slug = (url.searchParams.get('school') ?? '').toLowerCase().trim();
	const outcome = url.searchParams.get('outcome') === 'deny' ? 'deny' : 'admit';
	const name = sanitizeName(url.searchParams.get('name'));

	const schoolName =
		schoolConfigs[slug]?.schoolName ?? schoolStats[slug]?.name ?? 'a top university';
	const accent = schoolConfigs[slug]?.primaryColor ?? schoolStats[slug]?.color ?? '#0052CC';
	const fg = readableOn(accent);
	const isAdmit = outcome === 'admit';

	const headline = isAdmit
		? `${name} got into ${schoolName}! 🎉`
		: `${name}'s ${schoolName} decision`;

	const label = isAdmit ? 'ADMISSIONS SIMULATION' : 'DECISION SIMULATION';

	const tree = h(
		'div',
		{
			height: '100%',
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			padding: '72px 80px',
			backgroundColor: accent,
			color: fg,
			fontFamily: 'sans-serif'
		},
		[
			// Top row: wordmark + simulation label
			h(
				'div',
				{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
				[
					h('div', { fontSize: 30, fontWeight: 700, letterSpacing: '-0.5px' }, 'predictadmit.com'),
					h(
						'div',
						{
							fontSize: 22,
							fontWeight: 700,
							letterSpacing: '2px',
							padding: '10px 20px',
							borderRadius: '999px',
							border: `2px solid ${fg}`,
							opacity: 0.9
						},
						label
					)
				]
			),
			// Headline
			h(
				'div',
				{
					display: 'flex',
					fontSize: headline.length > 46 ? 66 : 80,
					fontWeight: 800,
					lineHeight: 1.08,
					letterSpacing: '-2px',
					maxWidth: '1040px'
				},
				headline
			),
			// Footer CTA
			h(
				'div',
				{ display: 'flex', alignItems: 'center', fontSize: 30, fontWeight: 600, opacity: 0.92 },
				isAdmit
					? 'Run your own admissions simulation — free →'
					: 'See if you can flip the decision — free →'
			)
		]
	);

	return new ImageResponse(tree as unknown as ConstructorParameters<typeof ImageResponse>[0], {
		width: 1200,
		height: 630,
		headers: {
			// Cache hard at the CDN: same params → same image, cheap to reuse.
			'cache-control': 'public, immutable, no-transform, max-age=31536000'
		}
	});
};
