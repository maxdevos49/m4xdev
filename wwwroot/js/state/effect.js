/**
 * Defines an "effect" to be performed when a signal is triggered.
 *
 * @param {Array<import('./signal').Signal<any>>} dependencies Signals this effect depends on.
 * @param {() => void} effect The effect callback to perform when any 1 of the dependency signals are triggered.
 *
 * @returns {import('./signal').Unsubscriber} A function to unsubscribe from all dependencies and remove the effect.
 */
export function createEffect(dependencies, effect) {
	/**@type {Array<import('./signal').Unsubscriber>} */
	const unsubscribers = [];

	for (const depSignal of dependencies) {
		unsubscribers.push(depSignal.subscribe(effect));
	}

	return () => {
		for (const unsubscriber of unsubscribers) {
			unsubscriber();
		}
	};
}

