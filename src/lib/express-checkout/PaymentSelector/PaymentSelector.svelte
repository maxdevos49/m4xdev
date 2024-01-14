<script>
	import Button from '../Button.svelte';
	import ChevronIcon from '../ChevronIcon.svelte';
	import MethodButton from './MethodButton.svelte';
	import { accordion } from './accordion';

	let showMoreOptions = false;
</script>

<div>
	<div class="options">
		<div class="options-header">
			<div class="primary-options">
				<MethodButton title="Card" iconSrc="card.svg" />
				<MethodButton title="PayPal" iconSrc="paypal.svg" />
				<MethodButton title="Klarna" iconSrc="klarna.svg" />
			</div>
			<Button color="default" variant="text" on:click={() => (showMoreOptions = !showMoreOptions)}>
				<ChevronIcon fill="black" rotation={showMoreOptions ? -90 : 90} />
			</Button>
		</div>
		<div class="secondary-options" use:accordion={showMoreOptions}>
			<MethodButton title="Afterpay" iconSrc="afterpay.svg" />
			<MethodButton title="CashApp" iconSrc="CashApp.svg" />
		</div>
	</div>
	<div class="description" />
</div>

<style lang="scss">
	.options {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.options-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
	}

	.primary-options {
		display: flex;
		gap: 8px;
	}

	.secondary-options {
		display: flex;
		gap: 8px;
	}
</style>
