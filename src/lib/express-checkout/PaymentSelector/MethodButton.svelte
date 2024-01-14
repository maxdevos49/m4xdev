<script lang="ts">
	export let iconSrc: string;
	export let title: string;
</script>

<button>
	<img src={iconSrc} alt={title + ' icon'} />
	{title}
</button>

<style lang="scss">
	button {
		background-color: transparent;
		border: 2px solid rgb(176, 176, 176);
		border-radius: 4px;

		padding: 8px 12px;
		flex: 1;

		&:hover {
			cursor: pointer;
			background-color: rgb(228, 228, 228);
			border: #21105d 2px solid;
		}
	}
</style>
