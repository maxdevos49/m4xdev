<script lang="ts">
	export let label = '';
</script>

<div class="menu">
	<h3>{label}</h3>
	<div class="options">
		<slot />
	</div>
</div>

<style lang="scss">
	h3 {
		display: inline-block;
		height: 100%;
		margin: 0;
		padding: 0.32rem 0.5rem;

		color: white;
	}

	.options {
		display: none;
		position: absolute;
		top: 100%;

		color: black;
		background-color: white;
		border: 1px solid rgb(203, 203, 203);
		border-bottom-left-radius: 0.2rem;
		border-bottom-right-radius: 0.2rem;
	}

	.menu {
		z-index: 1000;
		display: inline-block;
		position: relative;
	}

	.menu:hover {
		background-color: rgb(255, 255, 255);

		h3 {
			color: black;
		}

		.options {
			display: block;
		}
	}
</style>
