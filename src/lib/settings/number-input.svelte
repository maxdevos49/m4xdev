<script lang="ts">
	export let min: string = '';
	export let max: string = '';
	export let step: string = '';
	export let value: string = '';

	let focused = false;
	let input: HTMLInputElement;
</script>

<div>
	<button id="decrement" class:hide={focused} on:click|preventDefault={() => input.stepDown()}>‹</button>
	<input type="number" {min} {max} {step} bind:this={input} bind:value on:focusin={() => (focused = true)} on:focusout={() => (focused = false)} />
	<button id="increment" class:hide={focused} on:click|preventDefault={() => input.stepUp()}>›</button>
</div>

<style lang="scss">
	.hide {
		display: none;
	}

	div {
		position: relative;
		display: flex;
		border-radius: 0.2rem;
		overflow: hidden;
		margin-left: 0.5rem;
		flex: 1;
	}

	button {
		border: none;
		color: white;
		background-color: rgb(89, 89, 89);
		outline: none;

		&:hover {
			background-color: rgb(128, 128, 128);
		}
	}

	#decrement {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
	}

	#increment {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
	}

	input {
		display: inline-block;
		flex: 1;
		padding: 0.2rem 0.5rem;

		border: none;

		text-align: center;
		color: white;
		background-color: rgb(89, 89, 89);

		&:focus {
			text-align: left;
		}

		&::-webkit-inner-spin-button,
		&::-webkit-outer-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}
	}
</style>
