// Quick screenshot harness for visual verification.
// Usage: node scripts/shot.mjs <path> <outfile> [width] [height] [full]
// e.g.   node scripts/shot.mjs /ai /tmp/ai.png 1440 1024 full
import { chromium } from 'playwright';

const [, , path = '/', out = '/tmp/shot.png', w = '1440', h = '1024', full = 'full'] = process.argv;
const base = process.env.BASE || 'http://localhost:5199';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
// Block the service worker so we always see live code, not a cached shell.
await page.addInitScript(() => {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register = () => Promise.reject(new Error('blocked'));
	}
});
await page.goto(base + path, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1200);
await page.screenshot({ path: out, fullPage: full === 'full' });
console.log('shot →', out);
await browser.close();
