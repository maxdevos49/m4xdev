<script lang="ts">
	import ProductLine from './product-line.svelte';
	import SummaryLine from './summary-line.svelte';
	import type { ProductLineItem, SummaryLineItem } from './types';

	export let products = new Array<ProductLineItem>();
	export let summary = new Array<SummaryLineItem>();
</script>

<div class="cart">
	<div class="products">
		{#each products as item}
			<ProductLine {...item} />
		{/each}
	</div>
	<div class="summary">
		{#each summary as item}
			<SummaryLine {...item} />
		{/each}
	</div>
</div>
