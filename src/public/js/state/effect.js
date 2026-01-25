/**
 * @typedef {() => void} Cleanup
 */

/**
 * Defines an "effect" to be performed when a signal is triggered.
 *
 * @param {Array<import('./signal.js').Signal<any>>} dependencies Signals this effect depends on.
 * @param {() => Cleanup} effect The effect callback to perform when any 1 of the dependency signals are triggered.
 *
 * @returns {import('./signal.js').Unsubscriber} A function to unsubscribe from all dependencies and remove the effect.
 */
export function createEffect(dependencies, effect) {
	/**@type {Array<import('./signal.js').Unsubscriber>} */
	const unsubscribers = [];

	/** @type {(() => void)|null} */
	let cleanup = null;

	for (const depSignal of dependencies) {
		unsubscribers.push(depSignal.subscribe(() => {
			cleanup?.();
			cleanup = effect();
		}));
	}

	return () => {
		for (const unsubscriber of unsubscribers) {
			unsubscriber();
		}
	};
}

