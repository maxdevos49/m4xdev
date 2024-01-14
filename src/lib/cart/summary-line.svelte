<script lang="ts">
	export let type = '';
	export let label = '';
	export let total = 0;
	export let data = undefined;
	export let currency = 'USD';

	const formatCurrency = (amount: number, currency: string) =>
		new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency
		}).format(amount);
</script>

<div class="row">
	{#if type === 'total'}
		<h2 class="grow">{label}</h2>
		<h2>{formatCurrency(total, currency)}</h2>
	{:else}
		<h4 class="grow">
			{label}
			{#if data}
				- ({data})
				<span class="remove">[x]</span>
			{/if}
		</h4>
		<h4>{formatCurrency(total, currency)}</h4>
	{/if}
</div>

<style>
	h4 {
		margin: 0;
		padding: 0;
	}

	h2 {
		margin: 0;
		padding: 0;
	}

	.row {
		display: flex;
		flex-direction: row;
	}

	.grow {
		flex: 1;
	}

	.remove:hover {
		color: red;
	}
</style>
