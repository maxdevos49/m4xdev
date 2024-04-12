import {createSignal} from "../signal.js";

/**
 * Binds a signal to a input element.
 *
 * @param {HTMLInputElement|string} elementOrSelector
 *
 * @returns {import('../signal.js').Signal<string>}
 */
export function bindInput(elementOrSelector) {
	/** @type {HTMLElement|null} */
	const el = typeof elementOrSelector === "string" ? document.querySelector(elementOrSelector) : elementOrSelector;
	if (el === null && typeof elementOrSelector === "string") {
		throw new Error(`Cannot find element with selector "${elementOrSelector}"`);
	} else if (!(el instanceof HTMLInputElement)) {
		throw new TypeError("Expected an instance of HTMLInputElement");
	}

	const signal = createSignal(el.value);

	el.addEventListener("input", () => {
		signal.set(el.value);
	});

	signal.subscribe((value) => {
		el.value = value;
	});

	return signal;
}

/**
 * Binds a signal to a input element.
 *
 * @param {HTMLInputElement|string} elementOrSelector
 *
 * @returns {import('../signal.js').Signal<number>}
 */
export function bindNumberInput(elementOrSelector) {
	/** @type {HTMLElement|null} */
	const el = typeof elementOrSelector === "string" ? document.querySelector(elementOrSelector) : elementOrSelector;
	if (el === null && typeof elementOrSelector === "string") {
		throw new Error(`Cannot find element with selector "${elementOrSelector}"`);
	} else if (!(el instanceof HTMLInputElement) || el.type !== "number") {
		throw new TypeError("Expected an instance of HTMLInputElement with type \"number\"");
	}

	const signal = createSignal(Number(el.value));

	el.addEventListener("input", () => {
		signal.set(Number(el.value));
	});

	signal.subscribe((value) => {
		el.value = String(value);
	});

	return signal;
}
