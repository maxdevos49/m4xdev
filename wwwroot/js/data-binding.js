import {bindInnerHTML, bindInnerText} from "./state/bind/element.js";
import {bindInput} from "./state/bind/input.js";
import {bindSelect} from "./state/bind/select.js";
import {createComputed} from "./state/computed.js";

/**
 * Entry point for the data binding example.
 */
function main() {
	const text = bindInput("#bind-text");
	const textLength = createComputed(0, [text], () => text.get().length);
	bindInnerHTML("#bound-text-value", text);
	bindInnerHTML("#bound-text-value-length", textLength);

	const range = bindInput("#bind-range");
	bindInnerHTML("#bound-range-value", range);

	const select = bindSelect("#bind-select");
	bindInnerText("#bound-select-value", select);
}
main();
