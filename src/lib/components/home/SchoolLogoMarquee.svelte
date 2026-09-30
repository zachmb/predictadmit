<script lang="ts">
	import { schoolConfigs } from '$lib/config/schools';

	// Driven off the real school config so the strip always matches the 39 we simulate.
	const schools = Object.values(schoolConfigs).map((s) => ({
		name: s.schoolName,
		domain: s.footerDomain,
		// Google's favicon service returns each school's real seal/wordmark (Google-hosted,
		// no key, transparent-to-white). Chip background unifies the mismatched crops.
		logo: `https://www.google.com/s2/favicons?domain=${s.footerDomain}&sz=128`
	}));

	// Duplicate the list so the horizontal loop is seamless (track scrolls exactly -50%).
	const loop = [...schools, ...schools];
</script>

<div class="marquee group relative w-full overflow-hidden" aria-label="Schools PredictAdmit simulates">
	<!-- edge fades -->
	<div
		class="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent"
	></div>
	<div
		class="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent"
	></div>

	<div class="track flex w-max items-center gap-3 py-1">
		{#each loop as s, i (s.domain + '-' + i)}
			<div
				class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 sm:h-16 sm:w-16"
				title={s.name}
			>
				<img
					src={s.logo}
					alt={s.name}
					loading="lazy"
					width="128"
					height="128"
					class="h-8 w-8 object-contain opacity-70 transition duration-300 group-hover:opacity-90 sm:h-9 sm:w-9"
				/>
			</div>
		{/each}
	</div>
</div>

<style>
	.track {
		animation: marquee 55s linear infinite;
	}
	/* keep scrolling smooth; pause when a user hovers to read a specific logo */
	.marquee:hover .track {
		animation-play-state: paused;
	}
	@keyframes marquee {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.track {
			animation: none;
			overflow-x: auto;
		}
	}
</style>
