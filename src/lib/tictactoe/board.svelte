<script lang="ts">
	import Mark from './mark.svelte';
	import WinLine from './win-line.svelte';
	import { isScratch, isWon } from './logic';
	import { oBoard, xBoard, player } from './state';

	function resetGame() {
		xBoard.reset();
		oBoard.reset();
		player.set('x');
	}
</script>

<div class="board">
	<WinLine xBoard={$xBoard} oBoard={$oBoard} />
	<Mark x={0} y={0} />
	<Mark x={1} y={0} />
	<Mark x={2} y={0} />
	<Mark x={0} y={1} />
	<Mark x={1} y={1} />
	<Mark x={2} y={1} />
	<Mark x={0} y={2} />
	<Mark x={1} y={2} />
	<Mark x={2} y={2} />
</div>

<div>
	<div>
		{#if isScratch($xBoard, $oBoard)}
			<h2>Scratch!</h2>
		{:else if !(isWon($xBoard) || isWon($oBoard))}
			<h2>{$player.toUpperCase()} turn</h2>
		{:else}
			<h2>{$player.toUpperCase()} Won!</h2>
		{/if}
		<button on:click|preventDefault={resetGame}>Reset</button>
	</div>
</div>

<style>
	.board {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr 1fr;
		grid-gap: 1rem;

		position: relative;

		background-color: rgb(98, 94, 94);
	}
</style>
