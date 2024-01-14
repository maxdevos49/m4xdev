<script lang="ts">
	export let label: string = '';
	export let data: string | number = '';
	export let unit: string = '';
</script>

<div>
	<h4>{label}{data}{unit}</h4>
</div>

<style>
	div {
		position: relative;
	}

	h4 {
		display: inline-block;
		height: 100%;
		margin: 0;
		padding: 0.32rem 0.5rem;

		color: white;
	}
</style>
