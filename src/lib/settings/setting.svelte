<script lang="ts">
	import NumberInput from './number-input.svelte';

	export let label: string;
	export let type: 'number' | 'text' | 'color' = 'text';
	export let value: string = '';
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label>
	<span>{label}</span>
	{#if type === 'number'}
		<NumberInput bind:value />
	{:else}
		<input {type} {value} />
	{/if}
</label>

<style lang="scss">
	label {
		display: flex;

		padding: 0.5rem 1rem;
	}

	span {
		display: inline-block;
		width: 40%;
		min-width: min-content;
		text-align: right;
		white-space: nowrap;
		font-size: smaller;
		align-self: center;
	}

	input {
		display: inline-block;
		flex: 1;

		margin-left: 0.5rem;
		padding-top: 0.2rem;
		padding-bottom: 0.2rem;

		border-radius: 4px;
		border: none;

		text-align: center;
		color: white;
		background-color: rgb(89, 89, 89);

		&:focus {
			text-align: left;
		}
	}
</style>
