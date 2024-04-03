import {createSignal} from "./signal.js";

/**
 * Computes a new signal via 1 or more other signals.
 *
 * @template T
 *
 * @param {T} initialValue The initial value of the computed signal.
 * @param {Array<import('./signal').Signal<any>>} dependencies Signals this computed signal depends on.
 * @param {() => T} computer The callback to compute the new value of the signal when the
 *
 * @returns {import('./signal').Signal<T>}
 */
export function createComputed(initialValue, dependencies, computer) {
	const signal = createSignal(initialValue);

	const listener = () => {
		signal.set(computer());
	};

	for (const depSignal of dependencies) {
		depSignal.subscribe(listener);

		// TODO(improvement): Not doing anything with unsubscriber functions returned. .
	}

	return signal;
}

