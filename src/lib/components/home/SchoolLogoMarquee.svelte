<script lang="ts">
	import { schoolConfigs } from '$lib/config/schools';

	// Driven off the real school config so the strip always matches the 39 we simulate.
	const schools = Object.values(schoolConfigs).map((s) => ({
		name: s.schoolName,
		slug: s.slug,
		domain: s.footerDomain,
		// Google's favicon service returns each school's real seal/wordmark (Google-hosted,
		// no key, transparent-to-white).
		logo: `https://www.google.com/s2/favicons?domain=${s.footerDomain}&sz=128`
	}));

	// Duplicate the list so the horizontal loop is seamless (track scrolls exactly -50%).
	const loop = [...schools, ...schools];
</script>

<div class="marquee group relative w-full overflow-hidden" aria-label="Schools PredictAdmit simulates">
	<!-- edge fades (match the #FAFAFA hero background) -->
	<div
		class="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#FAFAFA] to-transparent"
	></div>
	<div
		class="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#FAFAFA] to-transparent"
	></div>

	<div class="track flex w-max items-center gap-8 py-1 sm:gap-10">
		{#each loop as s, i (s.domain + '-' + i)}
			<a
				href="/portals/{s.slug}"
				title="Rehearse the {s.name} portal"
				aria-label="Rehearse the {s.name} decision portal"
				class="shrink-0"
			>
				<img
					src={s.logo}
					alt={s.name}
					loading="lazy"
					width="128"
					height="128"
					class="h-9 w-9 object-contain opacity-70 transition duration-300 hover:opacity-100 hover:scale-110 sm:h-11 sm:w-11"
				/>
			</a>
		{/each}
	</div>
</div>

<style>
	.track {
		animation: marquee 75s linear infinite;
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
