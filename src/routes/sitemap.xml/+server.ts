import type { RequestHandler } from './$types';

// A simple sitemap so crawlers and AI answer engines discover the core pages
// (not just the landing). Kept as a route so it stays in sync with the app.
const BASE = 'https://predictadmit.com';

const PATHS = [
	'/',
	'/pro',
	'/ai',
	'/pricing',
	'/about',
	'/methodology',
	'/chances',
	'/portals',
	'/research-hub',
	'/summer-programs'
];

export const GET: RequestHandler = () => {
	const urls = PATHS.map(
		(p) => `  <url><loc>${BASE}${p}</loc><changefreq>weekly</changefreq></url>`
	).join('\n');
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'max-age=3600' }
	});
};
