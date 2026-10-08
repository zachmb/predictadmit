// Regenerate the Pro screenshots used on the landing page (the "See inside Pro"
// section in src/routes/+page.svelte). Renders each Pro workshop view in the
// CURRENT design and writes static/screenshots/pro-*.png, so the marketing
// screenshots never drift from the real app after a design change.
//
// Run: npm run shots
// It boots its own dev server on a dedicated port, captures, and cleans up.
//
// Wired to run automatically on commits that touch the Pro pages or the design
// tokens via .githooks/pre-commit (see that file).

import { chromium } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = resolve(ROOT, 'static/screenshots');
const PORT = 5211;
const BASE = `http://localhost:${PORT}`;

// Each Pro view → the sidebar label to click → the output file.
// 'dashboard' is the default view on load (no click needed).
const SHOTS = [
	{ file: 'pro-hub.png', click: null }, // dashboard (default)
	{ file: 'pro-universities.png', click: 'Universities' },
	{ file: 'pro-counselor.png', click: 'AI Counselor' },
	{ file: 'pro-chanceme.png', click: 'Chance Me' },
	{ file: 'pro-essay.png', click: 'Common App Personal' } // opens the editor
];

// A realistic Pro user so the views render populated (not empty states).
const SEED_USER = {
	isPro: true,
	name: 'Alex',
	email: 'alex@example.com',
	applicationProfile: {
		gpa: '3.94',
		activities:
			'Debate Team Captain (4 yrs, 300+ hrs, state finalist)\nFounded school Coding Club (40 members)\nVarsity Soccer\nHospital volunteer (150 hrs)',
		awards: 'National Merit Semifinalist; AIME qualifier',
		rigor: '11 APs',
		essays: ''
	}
};

function waitForServer(log) {
	return new Promise((res, rej) => {
		const t = setTimeout(() => rej(new Error('dev server timeout')), 60000);
		log.on('data', (b) => {
			if (/localhost:\d+/.test(b.toString())) {
				clearTimeout(t);
				res();
			}
		});
	});
}

async function main() {
	mkdirSync(OUT, { recursive: true });

	// Build + preview, NOT `vite dev`: the dev server's SSR stalls on the
	// lucide-svelte barrel import on some machines (fetchModule timeout -> /pro
	// 500s -> the networkidle goto below times out and the pre-commit hook
	// aborts every design commit). The production build is deterministic and is
	// also the exact code the screenshots should show.
	const built = spawnSync('npm', ['run', 'build'], { cwd: ROOT, stdio: 'inherit' });
	if (built.status !== 0) throw new Error('build failed before screenshots');
	const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
		cwd: ROOT,
		stdio: ['ignore', 'pipe', 'pipe']
	});
	try {
		await waitForServer(server.stdout);
		await sleep(1500);

		const browser = await chromium.launch();
		const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
		const pg = await ctx.newPage();
		await pg.addInitScript((u) => localStorage.setItem('predictadmit:user', JSON.stringify(u)), SEED_USER);

		// 'load' + a settle sleep, NOT networkidle: with the seeded Pro profile the
		// page keeps background requests going (analytics, API retries), so
		// networkidle never fires and the hook aborted every design commit.
		await pg.goto(`${BASE}/pro`, { waitUntil: 'load', timeout: 45000 });
		await sleep(3500);

		for (const { file, click } of SHOTS) {
			if (click) {
				const ok = await pg
					.getByText(click, { exact: true })
					.first()
					.click({ timeout: 8000 })
					.then(() => true)
					.catch(() => false);
				if (!ok) {
					console.warn(`  ! could not click "${click}" — skipping ${file}`);
					continue;
				}
				await sleep(1400);
			}
			await pg.screenshot({ path: resolve(OUT, file) });
			console.log(`  ✓ ${file}`);
		}

		await browser.close();
	} finally {
		server.kill('SIGTERM');
	}
	console.log('Landing screenshots regenerated in static/screenshots/');
}

main().catch((e) => {
	console.error('gen-landing-shots failed:', e.message);
	process.exit(1);
});
