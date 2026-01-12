<script lang="ts">
	export let data: { label: string; value: number }[] = [];
	export let max = 100;
	export let size = 200;
	export let color = 'text-emerald-500'; // Tailwind class for text color (used for fill/stroke logic if needed, or just CSS)

	// Calculate points for the polygon
	$: points = data
		.map((d, i) => {
			const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
			const radius = (d.value / max) * (size / 2);
			const x = size / 2 + radius * Math.cos(angle);
			const y = size / 2 + radius * Math.sin(angle);
			return `${x},${y}`;
		})
		.join(' ');

	// Calculate axis lines
	$: axes = data.map((d, i) => {
		const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
		const x = size / 2 + (size / 2) * Math.cos(angle);
		const y = size / 2 + (size / 2) * Math.sin(angle);
		return { x, y, label: d.label };
	});

	// Grid levels (e.g. 25%, 50%, 75%, 100%)
	const levels = [0.25, 0.5, 0.75, 1];
</script>

<div class="relative" style="width: {size}px; height: {size}px;">
	<svg width={size} height={size} viewBox="0 0 {size} {size}" class="overflow-visible">
		<!-- Background Grid Rings -->
		{#each levels as level}
			<circle
				cx={size / 2}
				cy={size / 2}
				r={(size / 2) * level}
				class="fill-none stroke-slate-100"
				stroke-width="1"
			/>
		{/each}

		<!-- Axis Lines -->
		{#each axes as axis}
			<line
				x1={size / 2}
				y1={size / 2}
				x2={axis.x}
				y2={axis.y}
				class="stroke-slate-100"
				stroke-width="1"
			/>
			<!-- Labels (Approximate positioning) -->
			<!-- We position text via foreignObject or pure SVG text. SVG text is simpler. -->
			<!-- Logic to push label out a bit -->
			<text
				x={size / 2 + (axis.x - size / 2) * 1.4}
				y={size / 2 + (axis.y - size / 2) * 1.4}
				text-anchor="middle"
				dominant-baseline="middle"
				class="text-[9px] font-bold uppercase tracking-widest fill-slate-400"
				style="font-size: 8px;"
			>
				{axis.label}
			</text>
		{/each}

		<!-- The Data Polygon -->
		<polygon
			{points}
			class="{color} fill-current opacity-20 stroke-current"
			stroke-width="2"
			stroke-linejoin="round"
		/>
		<polygon
			{points}
			class="{color} fill-none stroke-current"
			stroke-width="2"
			stroke-linejoin="round"
		/>

		<!-- Data Points -->
		{#each data as d, i}
			{@const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2}
			{@const radius = (d.value / max) * (size / 2)}
			{@const x = size / 2 + radius * Math.cos(angle)}
			{@const y = size / 2 + radius * Math.sin(angle)}
			<circle cx={x} cy={y} r="3" class="{color} fill-current" />
		{/each}
	</svg>
</div>
