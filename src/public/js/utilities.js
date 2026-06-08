const MONTH_STRINGS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];
const DAY_STRINGS = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];

/**
 * Converts a number to a string with its ordinal suffix
 *
 * @author https://stackoverflow.com/a/31615643/9318621
 *
 * @param {number} n The number to convert.
 * @returns {string} The number string with a ordinal suffix.
 */
function toOrdinal(n) {
	const s = ["th", "st", "nd", "rd"];
	const v = n % 100;
	return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * @template {string} [S=string]
 * @typedef {(el: S extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[S] : HTMLElement) => void} QSCallback
 */

/**
 * document.querySelector shorthand utility.
 *
 * @template {string} S
 *
 * @overload
 * @param {S} selector
 * @returns {S extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[S] | null : HTMLElement | null}
 *
 * //**
 *
 * @overload
 * @param {S} selector
 * @param {QSCallback<S>} cb
 * @returns {S extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[S] | null : HTMLElement | null}
 *
 * //**
 *
 * @overload
 * @param {HTMLElement|DocumentFragment|Document} scope
 * @param {S} selector
 * @returns {S extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[S] | null : HTMLElement | null}
 *
 * //**
 *
 * @overload
 * @param {HTMLElement|DocumentFragment|Document} scope
 * @param {S} selector
 * @param {QSCallback<S>} cb
 * @returns {S extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[S] | null : HTMLElement | null}
 *
 * //**
 *
 * @param {string|HTMLElement|DocumentFragment|Document} selectorOrScope
 * @param {string|QSCallback} [selectorOrCb]
 * @param {QSCallback} [cb]
 */
function qs(selectorOrScope, selectorOrCb, cb) {
	const scope =
		typeof selectorOrScope === "string" ? document : selectorOrScope;

	const selection =
		typeof selectorOrCb === "function" || selectorOrCb === undefined
			? /** @type {string}*/ (selectorOrScope)
			: selectorOrCb;

	const callback =
		cb ?? (typeof selectorOrCb === "function" ? selectorOrCb : undefined);

	const el = /** @type {HTMLElement|null} */ (scope.querySelector(selection));

	if (callback && el) {
		callback(el);
	}

	return el;
}

/**
 * document.querySelectorAll shorthand utility.
 *
 * @template {string} S
 *
 * @overload
 * @param {S} selectors
 * @returns {Array<S extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[S] : HTMLElement>}
 *
 * //**
 *
 * @overload
 * @param {HTMLElement|Document|DocumentFragment} scope
 * @param {S} selectors
 * @returns {Array<S extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[S] : HTMLElement>}
 *
 * //**
 *
 * @param {string|HTMLElement|DocumentFragment|Document} selectorsOrScope
 * @param {string} [selectors]
 */
function qsa(selectorsOrScope, selectors) {
	const scope =
		typeof selectorsOrScope === "string" ? document : selectorsOrScope;

	const selection =
		typeof selectorsOrScope === "string"
			? selectorsOrScope
			: /** @type {string} */ (selectors);

	return Array.from(scope.querySelectorAll(selection));
}

/**
 * Like {@link qs} but throws if the element is not found.
 *
 * @template {string} S
 *
 * @overload
 * @param {S} selector
 * @returns {S extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[S] : HTMLElement}
 *
 * //**
 *
 * @overload
 * @param {HTMLElement|DocumentFragment|Document} scope
 * @param {S} selector
 * @returns {S extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[S] : HTMLElement}
 *
 * //**
 *
 * @param {string|HTMLElement|DocumentFragment|Document} selectorOrScope
 * @param {string} [scopedSelector]
 */
function qsOrThrow(selectorOrScope, scopedSelector) {
	const element =
		typeof selectorOrScope === "string"
			? qs(selectorOrScope)
			: qs(selectorOrScope, /** @type {string} */ (scopedSelector));

	if (!element) {
		const selector =
			typeof selectorOrScope === "string"
				? selectorOrScope
				: scopedSelector;
		throw new Error(
			`qsOrThrow: element not found for selector "${selector}"`,
		);
	}

	return element;
}

export { MONTH_STRINGS, DAY_STRINGS, toOrdinal, qs, qsa, qsOrThrow };
