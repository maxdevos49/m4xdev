import {createSignal} from "../signal.js";

/**
 * Binds a signal to a select element.
 *
 * @param {HTMLSelectElement|string} elementOrSelector
 * @param {import('../signal.js').Signal<string>|undefined} signal
 *
 * @returns {import('../signal.js').Signal<string>}
 */
export function bindSelect(elementOrSelector, signal = undefined) {
	/** @type {HTMLElement|null} */
	const el = typeof elementOrSelector === "string" ? document.querySelector(elementOrSelector) : elementOrSelector;
	if (el === null && typeof elementOrSelector === "string") {
		throw new Error(`Cannot find element with selector "${elementOrSelector}"`);
	} else if (!(el instanceof HTMLSelectElement)) {
		throw new TypeError("Expected an instance of HTMLInputElement");
	}

	const sig = signal === undefined ? createSignal(el.value) : signal;

	el.addEventListener("input", () => {
		sig.set(el.value);
	});

	sig.subscribe((value) => {
		el.value = value;
	});

	return sig;
}

