<script lang="ts">
	export let label = 'My Field';
	export let name = 'my_field';
	export let type = 'text';
	export let placeholder = '';
	export let value = '';
</script>

<div class="field-control">
	<label>
		<span>{label}</span>
		<input {name} {type} {placeholder} {value} />
	</label>
</div>

<style>
	label {
		display: flex;
		flex-direction: column;
	}

	input {
		border: 1px solid black;
		border-radius: 0.2rem;
		padding: 0.5rem;
	}

	.field-control {
		position: relative;
		margin: 0;
		padding: 0.2rem;
	}
</style>
