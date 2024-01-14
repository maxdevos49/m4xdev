<script lang="ts">
	export let id = '';
	export let name = '';
	export let quantity = 0;
	export let amount = 0;
	export let total = 0;
	export let currency = 'USD';

	const formatCurrency = (amount: number, currency: string) =>
		new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency
		}).format(amount);
</script>

<div class="product-line row" data-product-id={id}>
	<div class="col grow">
		<div class="row">
			<h3>{name}</h3>
		</div>
		<span>
			{quantity} x {formatCurrency(amount, currency)}
		</span>
	</div>
	<div>
		<h3>{formatCurrency(total, currency)}</h3>
	</div>
</div>

<style>
	h3 {
		margin: 0;
		padding: 0;
	}

	.row {
		display: flex;
		flex-direction: row;
	}

	.col {
		display: flex;
		flex-direction: column;
	}

	.grow {
		flex: 1;
	}

	.product-line {
		border-bottom: 1px solid black;
	}
</style>
