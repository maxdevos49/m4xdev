<script lang="ts">
	export let rotation = 0;
	export let height = '1em';
	export let fill = 'currentColor';
</script>

<svg viewBox="0 0 6 10" xmlns="http://www.w3.org/2000/svg" style:height style:width={height} style:fill style:--rotation={rotation + 'deg'}>
	<path d="M1.27918 0.5L0.22168 1.5575L3.65668 5L0.22168 8.4425L1.27918 9.5L5.77918 5L1.27918 0.5Z" fill-opacity="0.87" />
</svg>

<style lang="scss">
	svg {
		transform: rotate(var(--rotation));

		transition: transform 0.3s ease-in-out;
	}
</style>
