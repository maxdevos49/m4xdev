/**
 * @template T
 * @typedef {import('../signal.js').Signal<T>} Signal
 */

/**
 * @typedef {import('../signal.js').Unsubscriber} Unsubscriber
 */

/**
 * @param {string|Element} selectorOrElement
 */
function resolveElement(selectorOrElement) {
	const element =
		typeof selectorOrElement === "string"
			? document.querySelector(selectorOrElement)
			: selectorOrElement;

	if (element === null && typeof selectorOrElement === "string") {
		throw new Error(
			`Cannot find element with selector "${selectorOrElement}".`,
		);
	} else if (!(element instanceof HTMLElement)) {
		throw new TypeError("Expected an instance of HTMLElement");
	}

	return element;
}

/**
 * Binds a signals value to a HTML elements innerText.
 *
 * @overload
 * @param {string} selector
 * @param {Signal<any>} signal
 * @returns {Unsubscriber}
 *
 * //**
 *
 * @overload
 * @param {HTMLElement} element
 * @param {Signal<any>} signal
 * @returns {Unsubscriber}
 *
 * //**
 *
 * @overload
 * @param {HTMLElement|DocumentFragment|Document} scope
 * @param {string} selector
 * @param {Signal<any>} signal
 * @returns {Unsubscriber}
 *
 * //**
 *
 * @param {string|HTMLElement|DocumentFragment|Document} selectorOrElementOrScope
 * @param {string|Signal<any>} selectorOrSignal
 * @param {Signal<any>} [signal]
 *
 */
function bindInnerText(selectorOrElementOrScope, selectorOrSignal, signal) {
	if (typeof selectorOrElementOrScope === "string") {
		const selector = selectorOrElementOrScope;
		const resolvedSignal = /** @type {Signal<any>} */ (selectorOrSignal);

		const element = document.querySelector(selector);
		if (element === null) {
			throw new Error(`Cannot find element with selector "${selector}"`);
		} else if (!(element instanceof HTMLElement)) {
			throw new TypeError("Expected an instance of HTMLElement.");
		}

		return resolvedSignal.subscribe((value) => {
			element.innerText = String(value);
		});
	}

	if (
		selectorOrElementOrScope instanceof HTMLElement &&
		typeof selectorOrSignal !== "string"
	) {
		const element = selectorOrElementOrScope;
		const resolvedSignal = selectorOrSignal;

		return resolvedSignal.subscribe((value) => {
			element.innerText = String(value);
		});
	}

	const scope = selectorOrElementOrScope;
	const selector = /** @type {string} */ (selectorOrSignal);
	const resolvedSignal = /** @type {Signal<any>} */ (signal);

	const element = scope.querySelector(selector);
	if (element === null) {
		throw new Error(`Cannot find element with selector "${selector}"`);
	} else if (!(element instanceof HTMLElement)) {
		throw new TypeError("Expected an instance of HTMLElement.");
	}

	return resolvedSignal.subscribe((value) => {
		element.innerText = String(value);
	});
}

/**
 * Binds a signals value to a HTML elements innerHTML.
 *
 * @overload
 * @param {string} selector
 * @param {Signal<any>} signal
 * @returns {Unsubscriber}
 *
 * //**
 *
 * @overload
 * @param {Element} element
 * @param {Signal<any>} signal
 * @returns {Unsubscriber}
 *
 * //**
 *
 * @param {string|Element} selectorOrElement
 * @param {Signal<any>} signal
 */
function bindInnerHTML(selectorOrElement, signal) {
	const element = resolveElement(selectorOrElement);
	return signal.subscribe((value) => {
		element.innerHTML = String(value);
	});
}

export { bindInnerText, bindInnerHTML };
