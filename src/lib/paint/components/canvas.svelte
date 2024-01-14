<script lang="ts">
	import { onMount } from 'svelte';

	export let mouseX = 0;
	export let mouseY = 0;

	export let canvasX = 300;
	export let canvasY = 100;
	export let canvasW = 800;
	export let canvasH = 400;
	export let canvasS = 1;

	export function undo() {
		if (lines.length) {
			lineHistory.push(lines.pop());
			lines = lines;
		}
	}

	export function redo() {
		if (lineHistory.length) {
			lines.push(lineHistory.pop());
			lines = lines;
		}
	}

	export function save() {
		const blob = new Blob([contentElement.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(blob);

		const downloadLink = document.createElement('a');
		downloadLink.href = url;
		downloadLink.download = 'mypicture.svg';
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	}

	type Point = { x: number; y: number };
	type Line = { points: Point[]; color: string };

	let contentElement: SVGSVGElement;
	let contentBounds: DOMRect;

	let drawing = false;
	let lines: Line[] = [];
	let lineHistory: Line[] = [];
	let color = 'black';

	onMount(() => {
		contentBounds = contentElement.getBoundingClientRect();
	});

	function handleMousemove(event: MouseEvent) {
		mouseX = event.clientX - contentBounds.left + window.scrollX;
		mouseY = event.clientY - contentBounds.top + window.scrollY;

		if (drawing) {
			const currentLine = lines[lines.length - 1];

			currentLine.points.push({ x: mouseX, y: mouseY });
			lines = lines;
		}
	}

	function handleMouseDown(event: MouseEvent) {
		drawing = true;

		lines.push({ points: [{ x: mouseX, y: mouseY }], color });
		lines = lines;

		lineHistory = [];
	}

	function handleMouseUp(event: MouseEvent) {
		drawing = false;
	}
</script>

<div style:--canvasX={canvasX + 'px'} style:--canvasY={canvasY + 'px'} style:--canvasW={canvasW + 'px'} style:--canvasH={canvasH + 'px'} style:--canvasS={canvasS}>
	<svg
		bind:this={contentElement}
		on:mousemove|preventDefault={handleMousemove}
		on:mousedown|preventDefault={handleMouseDown}
		on:mouseup|preventDefault={handleMouseUp}
		viewBox="0 0 {canvasW} {canvasH}"
		xmlns="http://www.w3.org/2000/svg"
	>
		{#each lines as line, i}
			{console.log(i)}
			<polyline points={line.points.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke={line.color + ''} />
		{/each}
	</svg>
</div>

<style>
	div {
		position: relative;
		height: 100%;
		width: 100%;
	}

	svg {
		border: 1px solid rgb(141, 137, 137);
		transform: translate(var(--canvasX), var(--canvasY)) scale(var(--canvasS));
		transform-origin: top left;
		width: var(--canvasW);
		height: var(--canvasH);

		cursor: crosshair;

		background-image: linear-gradient(45deg, #d7d7d7 25%, transparent 25%), linear-gradient(-45deg, #d7d7d7 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d7d7d7 75%),
			linear-gradient(-45deg, transparent 75%, #d7d7d7 75%);
		background-size: 20px 20px;
		background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
	}
</style>
