<script lang="ts">
	import ChevronIcon from './ChevronIcon.svelte';

	export let open = false;
</script>

<details bind:open>
	<summary>
		<slot name="label" />
		<span style="flex: 1;" />
		<ChevronIcon rotation={open ? -90 : 90} />
	</summary>
	<div>
		<slot name="content" />
	</div>
</details>

<style lang="scss">
	details > summary {
		list-style: none;
	}
	details > summary::-webkit-details-marker {
		display: none;
	}

	summary {
		display: flex;
		background-color: white;
		margin-top: -1.5px;
		border-top: 1.5px solid rgb(176, 176, 176);

		padding: 8px 12px;
		transition: all 0.3s ease-in-out;
	}

	details[open] > summary {
		margin-bottom: 10px;
		background-color: rgb(235, 235, 235);
	}

	details > div {
		padding: 8px 12px;
	}
</style>
