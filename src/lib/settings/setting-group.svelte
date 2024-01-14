<script lang="ts">
	export let title = '';
	export let open = false;
</script>

<details {open}>
	<summary><span>{title}</span></summary>
	<div>
		<slot />
	</div>
</details>

<style lang="scss">
	details {
		margin: 0;
		padding: 0;

		user-select: none;
	}

	summary {
		margin: 0;
		padding: 0.5rem 1rem;

		background-color: rgb(66, 66, 66);

		span {
			padding-left: 0.3rem;
		}
	}

	details {
		background-color: rgb(56, 56, 56);
	}
</style>
