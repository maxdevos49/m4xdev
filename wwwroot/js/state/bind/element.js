/**
 * Binds a signals value to a HTML elements innerHTML.
 *
 * @param {HTMLInputElement|string} elementOrSelector
 * @param {import('../signal.js').Signal<any>} signal
 *
 * @returns {import('../signal.js').Unsubscriber}
 */
export function bindInnerHTML(elementOrSelector, signal) {
	/** @type {HTMLElement|null} */
	const el = typeof elementOrSelector === "string" ? document.querySelector(elementOrSelector) : elementOrSelector;
	if (el === null && typeof elementOrSelector === "string") {
		throw new Error(`Cannot find element with selector "${elementOrSelector}"`);
	} else if (!(el instanceof HTMLElement)) {
		throw new TypeError("Expected an instance of HTMLElement");
	}

	return signal.subscribe((value) => {
		el.innerHTML = String(value);
	});
}

/**
 * Binds a signals value to a HTML elements innerText.
 *
 * @param {HTMLInputElement|string} elementOrSelector
 * @param {import('../signal.js').Signal<any>} signal
 *
 * @returns {import('../signal.js').Unsubscriber}
 */
export function bindInnerText(elementOrSelector, signal) {
	/** @type {HTMLElement|null} */
	const el = typeof elementOrSelector === "string" ? document.querySelector(elementOrSelector) : elementOrSelector;
	if (el === null && typeof elementOrSelector === "string") {
		throw new Error(`Cannot find element with selector "${elementOrSelector}"`);
	} else if (!(el instanceof HTMLElement)) {
		throw new TypeError("Expected an instance of HTMLElement");
	}

	return signal.subscribe((value) => {
		el.innerText = String(value);
	});
}
