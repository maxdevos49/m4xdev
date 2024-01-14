<script>
	import Button from './Button.svelte';
	import Details from './Details.svelte';
	import PaymentSelector from './PaymentSelector/PaymentSelector.svelte';
</script>

<div class="root">
	<main>
		<section class="left">
			<header>
				<img src="#" alt="Merchant Logo" />
			</header>

			<div class="content">
				<!-- Payment method / billing-->
				<div class="content-section">
					<Details open={true}>
						<svelte:fragment slot="label">Payment</svelte:fragment>
						<svelte:fragment slot="content">
							<PaymentSelector />
						</svelte:fragment>
					</Details>
					<Details>
						<svelte:fragment slot="label">Bill to</svelte:fragment>
						<svelte:fragment slot="content">Content....</svelte:fragment>
					</Details>
				</div>

				<!-- Shipping address / ship by -->
				<div class="content-section">
					<Details>
						<svelte:fragment slot="label">Ship to</svelte:fragment>
						<svelte:fragment slot="content">Content....</svelte:fragment>
					</Details>
					<Details>
						<svelte:fragment slot="label">Delivery</svelte:fragment>
						<svelte:fragment slot="content">Content....</svelte:fragment>
					</Details>
				</div>

				<!-- Additional fields -->
				<div class="content-section">
					<Details>
						<svelte:fragment slot="label">+ Order Note</svelte:fragment>
						<svelte:fragment slot="content">Content....</svelte:fragment>
					</Details>
					<Details>
						<svelte:fragment slot="label">+ How did you find us</svelte:fragment>
						<svelte:fragment slot="content">Content....</svelte:fragment>
					</Details>
				</div>
			</div>

			<footer>
				<Button>Place Order</Button>
				<a href="#">Exit checkout</a>
			</footer>
		</section>
		<section class="right" />
	</main>
</div>

<style lang="scss">
	div.root {
		position: relative;
		width: 100vw;
		height: 100vh;

		overflow: hidden;
	}

	main {
		display: flex;
		max-width: 70rem;
		height: 100%;

		margin: 0 auto;

		section {
			display: flex;
			flex-direction: column;
			width: 50%;
			border: 1px solid red;

			header,
			footer,
			div.content {
				padding: 16px 12px;
			}

			header {
				display: flex;
				border-bottom: 2px solid rgb(176, 176, 176);

				img {
					border: 1px solid green;
					height: 2.5rem;
				}
			}

			footer {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-top: 2px solid rgb(176, 176, 176);
			}

			.content {
				display: flex;
				flex-direction: column;
				gap: 16px;
				flex: 1;
				overflow: auto;

				.content-section {
					border: 1.5px solid rgb(176, 176, 176);
					border-radius: 4px;
					overflow: hidden;
				}
			}
		}
	}
</style>
