<script lang="ts" context="module">
	export type ButtonType = 'button' | 'submit' | 'reset';
	export type ButtonColor = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default';
	export type ButtonVariant = 'contained' | 'pill' | 'outlined' | 'text';
	export type ButtonSize = 'small' | 'medium' | 'large';
</script>

<script lang="ts">
	export let name = '';
	export let value = '';
	export let type: ButtonType = 'button';
	export let targetId = '';

	export let color: ButtonColor = 'primary';
	export let variant: ButtonVariant = 'contained';
	export let size: ButtonSize = 'large';
</script>

<button
	{name}
	{value}
	{type}
	data-target-id={targetId}
	class:contained={variant === 'contained'}
	class:pill={variant === 'pill'}
	class:outlined={variant === 'outlined'}
	class:text={variant === 'text'}
	class:primary={color === 'primary'}
	class:success={color === 'success'}
	class:warning={color === 'warning'}
	class:error={color === 'error'}
	class:info={color === 'info'}
	class:default={color === 'default'}
	class:small={size === 'small'}
	class:medium={size === 'medium'}
	class:large={size === 'large'}
	on:click
>
	<slot />
</button>

<style lang="scss">
	$primary: #21105d;
	$primary-active: #0c0030;
	$primary-hover: #f7f4ff;

	$success: #2e7d32;
	$success-active: #1b5e20;
	$success-hover: #e8f5e9;

	$warning: #ef6c00;
	$warning-active: #e65100;
	$warning-hover: #fff3e0;

	$error: #d32f2f;
	$error-active: #b71c1c;
	$error-hover: #ffebee;

	$info: #0288d1;
	$info-active: #01579b;
	$info-hover: #e1f5fe;

	$default: #eeeeee;
	$default-active: #eeeeee;
	$default-hover: #eeeeee;

	button {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		border-radius: 8px;

		font-family: inherit;
		font-style: normal;
		font-weight: 500;
		white-space: nowrap;

		color: inherit;
		background-color: transparent;
		border: 1px solid transparent;

		&.large {
			padding: 12px 24px;
			gap: 8px;

			font-size: 16px;
		}

		&.medium {
			padding: 8px 16px;
			gap: 6px;

			font-size: 14px;
		}

		&.small {
			padding: 6px 12px;
			gap: 4px;

			font-size: 12px;
		}

		@mixin button-color($color, $bg-color, $bg-active-color, $bg-hover-color) {
			&.contained {
				color: $color;
				background-color: $bg-color;
				border: 1px solid $bg-color;

				&:hover,
				&:active {
					color: $color;
					background-color: $bg-active-color;
					border: 1px solid $bg-active-color;
				}
			}

			&.pill {
				color: $bg-color;
				background-color: $bg-hover-color;
				border: 1px solid $bg-color;
				border-radius: 100px;

				&:hover,
				&:active {
					color: $bg-active-color;
					background-color: $color;
					border: 1px solid $bg-active-color;
				}
			}

			&.outlined {
				color: $bg-color;
				background-color: $color;
				border: 1px solid $bg-color;

				&:hover,
				&:active {
					color: $bg-active-color;
					background-color: $bg-hover-color;
					border: 1px solid $bg-active-color;
				}
			}

			&.text {
				color: $bg-color;
				background-color: transparent;
				border: 1px solid transparent;

				&:hover,
				&:active {
					color: $bg-active-color;
					background-color: $bg-hover-color;
					border: 1px solid $bg-hover-color;
				}
			}
		}

		&.primary {
			@include button-color(white, $primary, $primary-active, $primary-hover);
		}
		&.success {
			@include button-color(white, $success, $success-active, $success-hover);
		}
		&.warning {
			@include button-color(white, $warning, $warning-active, $warning-hover);
		}
		&.error {
			@include button-color(white, $error, $error-active, $error-hover);
		}
		&.info {
			@include button-color(white, $info, $info-active, $info-hover);
		}
		&.default {
			@include button-color(white, $default, $default-active, $default-hover);
		}
	}
</style>
