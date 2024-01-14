<script lang="ts">
	import Canvas from './components/canvas.svelte';
	import MenuItemDivider from './components/menu-item-divider.svelte';
	import MenuItem from './components/menu-item.svelte';
	import MenuInformation from './components/menu-information.svelte';
	import Menu from './components/menu.svelte';

	let mouseX: number;
	let mouseY: number;

	let canvasX: number;
	let canvasY: number;
	let canvasW: number;
	let canvasH: number;
	let canvasS: number;

	let canvas: Canvas;
</script>

<main>
	<div class="header-menu">
		<Menu label="File">
			<MenuItem label="Export" />
			<MenuItemDivider />
			<MenuItem label="Save" keyBinding="Meta + S" action={canvas?.save} />
		</Menu>
		<Menu label="Edit">
			<MenuItem label="Undo" keyBinding="Meta + Z" action={canvas?.undo} />
			<MenuItem label="Redo" keyBinding="Meta + Shift + Z" action={canvas?.redo} />
			<MenuItemDivider />
			<MenuItem label="Cut" keyBinding="Meta + X" />
			<MenuItem label="Copy" keyBinding="Meta + C" />
			<MenuItem label="Paste" keyBinding="Meta + V" />
		</Menu>
	</div>
	<div class="content">
		<Canvas bind:this={canvas} bind:mouseX bind:mouseY bind:canvasX bind:canvasY bind:canvasW bind:canvasH bind:canvasS />
	</div>
	<div class="footer-menu">
		<MenuInformation label="Mouse" />
		<MenuInformation label="X: " data={mouseX} unit="px" />
		<MenuInformation label="Y: " data={mouseY} unit="px" />
		<MenuInformation label="Canvas" />
		<MenuInformation label="X: " data={canvasX} unit="px" />
		<MenuInformation label="Y: " data={canvasY} unit="px" />
		<MenuInformation label="W: " data={canvasW} unit="px" />
		<MenuInformation label="H: " data={canvasH} unit="px" />
		<MenuInformation label="S: " data={canvasS * 100} unit="%" />
	</div>
</main>

<style>
	main {
		position: relative;
		height: 100%;

		overflow: hidden;

		border-radius: 0.2rem;
		border: 1px solid rgb(198, 198, 198);
		background-color: rgb(255, 255, 255);
	}
	.header-menu {
		position: absolute;
		width: 100%;
		height: 2rem;
		top: 0;
		left: 0;

		background-color: rgb(94, 94, 94);
	}

	.content {
		position: absolute;
		height: calc(100% - 4rem);
		width: 100%;
		top: 2rem;
		background: whitesmoke;
	}

	.footer-menu {
		position: absolute;
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 2rem;
		bottom: 0;
		left: 0;

		background-color: rgb(94, 94, 94);
	}
</style>
