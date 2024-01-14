<script lang="ts">
	import { isMarked, isWon } from './logic';
	import { xBoard, oBoard, player } from './state';

	export let x: number = 0;
	export let y: number = 0;

	let mark = '';
	$: if (isMarked(x, y, $xBoard)) {
		mark = 'x';
	} else if (isMarked(x, y, $oBoard)) {
		mark = 'o';
	} else {
		mark = '';
	}

	function playTurn() {
		if (isWon($xBoard) || isWon($oBoard)) {
			return;
		}

		if ($player === 'x' && !isMarked(x, y, $oBoard)) {
			xBoard.mark(x, y);

			if (isWon($xBoard)) {
				return;
			}

			$player = 'o';
		} else if (!isMarked(x, y, $xBoard)) {
			oBoard.mark(x, y);

			if (isWon($oBoard)) {
				return;
			}

			$player = 'x';
		}
	}
</script>

<button on:click={playTurn}>
	<span class="mark">{mark}</span>
</button>

<style>
	button {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 10rem;
		height: 10rem;
		border: none;
		background: white;
	}

	.mark {
		font-size: 8rem;
		font-weight: bold;
	}
</style>
