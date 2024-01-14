<script lang="ts">
	export let label = '';
	export let keyBinding = '';

	export let action: () => void | null = null;
</script>

<div on:click={action}>
	<span style="white-space:nowrap">{label}</span>
	{#if keyBinding}
		<kbd style="white-space:nowrap">{keyBinding}</kbd>
	{/if}
</div>

<style>
	div {
		display: flex;
		flex-direction: row;
		min-width: 10rem;
		padding: 0.2rem;
		background-color: red;
	}

	span {
		flex: 1;
		padding-right: 1rem;
	}

	kbd {
		background-color: rgb(224, 224, 224);
		border-radius: 0.2rem;
		padding: 0 0.2rem;
	}

	div:hover {
		background-color: rgb(209, 209, 209);
		cursor: pointer;
	}
</style>
