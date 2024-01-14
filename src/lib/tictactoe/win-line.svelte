<script lang="ts">
	import { isWon, mask } from './logic';
	import { WIN_DIAGONAL_1, WIN_DIAGONAL_2, WIN_HORIZONTAL_1, WIN_HORIZONTAL_2, WIN_HORIZONTAL_3, WIN_VERTICAL_1, WIN_VERTICAL_2, WIN_VERTICAL_3 } from './logic';

	export let xBoard: number = 0;
	export let oBoard: number = 0;

	function isWonLocation(xBoard: number, oBoard: number): [string, string, string, string, string] {
		const winBoard = isWon(xBoard) ? xBoard : oBoard;

		const p0 = '0';
		const p1 = '4.5rem';
		const p2 = '15.5rem';
		const p3 = '26.5rem';
		const p4 = '30rem';

		if (mask(winBoard, WIN_HORIZONTAL_1)) {
			return [p0, p1, '100%', '1rem', '0'];
		} else if (mask(winBoard, WIN_HORIZONTAL_2)) {
			return [p0, p2, '100%', '1rem', '0'];
		} else if (mask(winBoard, WIN_HORIZONTAL_3)) {
			return [p0, p3, '100%', '1rem', '0'];
		} else if (mask(winBoard, WIN_VERTICAL_1)) {
			return [p1, p0, '1rem', '100%', '0'];
		} else if (mask(winBoard, WIN_VERTICAL_2)) {
			return [p2, p0, '1rem', '100%', '0'];
		} else if (mask(winBoard, WIN_VERTICAL_3)) {
			return [p3, p0, '1rem', '100%', '0'];
		} else if (mask(winBoard, WIN_DIAGONAL_1)) {
			return [p0, p0, '42rem', '1rem', '45deg'];
		} else if (mask(winBoard, WIN_DIAGONAL_2)) {
			return [p0, p4, '42rem', '1rem', '-45deg'];
		}

		return [p0, p0, '0', '0', '0'];
	}

	$: [x, y, w, h, r] = isWonLocation(xBoard, oBoard);
</script>

{#if location !== null}
	<div class="line" style:--x={x} style:--y={y} style:--w={w} style:--h={h} style:--r={r} />
{/if}

<style lang="scss">
	.line {
		background-color: red;
		position: absolute;
		width: var(--w);
		height: var(--h);
		left: var(--x);
		top: var(--y);
		transform: rotate(var(--r));
		transform-origin: 0.5rem 0.5rem;
	}
</style>
