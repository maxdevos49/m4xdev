import { createSignal } from "../signal.js";

/**
 * @template T
 * @typedef {import('../signal.js').Signal<T>} Signal
 */

/**
 * @template T
 * @typedef {(value: string) => T} Parser
 */

/**
 * @template [T=string]
 * @param {Element} element
 * @param {Parser<T>} [parser]
 * @returns {Signal<T>}
 */
function createInputSignal(element, parser) {
	if (!(element instanceof HTMLInputElement)) {
		throw new TypeError("Expected an instance of HTMLInputElement.");
	}

	const getValue = () =>
		/** @type {T} */ (parser ? parser(element.value) : element.value);

	const signal = createSignal(getValue());

	element.addEventListener("input", () => {
		signal.set(getValue());
	});

	signal.subscribe((value) => {
		element.value = String(value);
	});

	return signal;
}

/**
 * Binds a signal to a input element.
 *
 * @template [T=string]
 *
 * @overload
 * @param {string} selector
 * @param {Parser<T>} [parser]
 * @returns {Signal<T>}
 *
 * //**
 *
 * @overload
 * @param {HTMLInputElement} element
 * @param {Parser<T>} [parser]
 * @returns {Signal<T>}
 *
 * //**
 *
 * @overload
 * @param {HTMLElement|DocumentFragment|Document} scope
 * @param {string} selector
 * @param {Parser<T>} [parser]
 * @returns {Signal<T>}
 *
 * //**
 *
 * @param {string|HTMLElement|DocumentFragment|Document} selectorOrElementOrScope
 * @param {string|Parser<T>} [scopedSelectorOrParser]
 * @param {Parser<T>} [parser]
 */
function bindInput(selectorOrElementOrScope, scopedSelectorOrParser, parser) {
	if (typeof selectorOrElementOrScope === "string") {
		const selector = selectorOrElementOrScope;
		const resolvedParser = /** @type {Parser<T>|undefined}*/ (
			scopedSelectorOrParser
		);

		const element = document.querySelector(selector);
		if (element === null) {
			throw new Error(`Cannot find element with selector "${selector}"`);
		}

		return createInputSignal(element, resolvedParser);
	}

	if (selectorOrElementOrScope instanceof HTMLInputElement) {
		const element = selectorOrElementOrScope;
		const resolvedParser = /** @type {Parser<T>|undefined}*/ (
			scopedSelectorOrParser
		);

		return createInputSignal(element, resolvedParser);
	}

	const scope = selectorOrElementOrScope;
	const selector = /** @type {string} */ (scopedSelectorOrParser);

	const element = scope.querySelector(selector);
	if (element === null) {
		throw new Error(`Cannot find element with selector "${selector}"`);
	}

	return createInputSignal(element, parser);
}

export { bindInput };
