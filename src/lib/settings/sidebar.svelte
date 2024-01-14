<script lang="ts">
	import { onMount } from 'svelte';

	let resizing = false;
	let resizeOffset = 0;
	let sidebar: HTMLDivElement;

	function resizeStart(e: MouseEvent) {
		resizing = true;
		resizeOffset = e.offsetX;
	}

	function resize(e: MouseEvent) {
		if (resizing) {
			sidebar.style.width = `${e.x - resizeOffset}px`;
		}
	}

	function resizeStop() {
		resizing = false;
	}

	onMount(() => {
		window.addEventListener('mousemove', resize);
		window.addEventListener('mouseup', resizeStop);

		return () => {
			window.removeEventListener('mousemove', resize);
			window.removeEventListener('mouseup', resizeStop);
		};
	});

	export let title = '';
	export let hide = false;
</script>

<div class="sidebar-tab" class:hide={!hide}>
	<button on:click|preventDefault={() => (hide = false)}>{title} &rsaquo;</button>
</div>
<div class="sidebar" class:hide bind:this={sidebar}>
	<div class="header">
		<h3>{title}</h3>
		<button on:click|preventDefault={() => (hide = true)}>&times;</button>
	</div>
	<div class="resize" on:mousedown={resizeStart}>
		<div class="handle" />
	</div>
	<div class="content">
		<slot />
	</div>
</div>

<style lang="scss">
	.hide {
		display: none;
	}

	.sidebar-tab {
		position: fixed;
		top: 0;
		left: 0;
	}

	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		min-width: 20rem;
		max-width: 40rem;

		background-color: rgb(66, 66, 66);
		color: white;
	}

	.header {
		display: flex;
		flex-direction: row;

		padding: 1rem;

		background-color: rgb(35, 35, 35);

		user-select: none;

		h3 {
			flex-grow: 1;
			margin: 0;
			padding: 0;

			font-size: 1.5rem;
		}

		button {
			display: inline-block;

			margin: 0;
			padding: 0;
			border: none;

			font-size: 1.5rem;
			font-weight: bold;

			color: white;
			background-color: transparent;

			&:hover {
				opacity: 0.8;
			}
		}
	}

	.resize {
		display: flex;
		position: absolute;
		top: 0;
		left: 100%;
		bottom: 0;
		width: 0.7rem;

		justify-content: center;
		align-items: center;

		background-color: grey;
		cursor: col-resize;

		transition: all 0.3s;

		.handle {
			height: 5rem;
			width: 0.3rem;
			border-radius: 0.2rem;

			background-color: white;

			transition: all 0.3s;
		}

		&:hover {
			width: 1rem;

			.handle {
				width: 0.3rem;
			}
		}
	}

	.content {
	}
</style>
