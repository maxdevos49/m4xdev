import {DAY_STRINGS, MONTH_STRINGS, toOrdinal} from "./utilities.js";

/**
 * Updates the headers date.
 */
function headerDateHandler() {
	const dateSpan = document.querySelector("#header-date");
	if (!dateSpan) {
		return;
	}

	const date = new Date();
	dateSpan.innerHTML = `${DAY_STRINGS[date.getDay()]} ${MONTH_STRINGS[date.getMonth()]} ${toOrdinal(date.getDate())}, ${date.getFullYear()}`;
}



/**
 * Updates the headers time.
 */
function headerTimeHandler() {
	const timeSpan = document.querySelector("#header-time");
	if (!timeSpan) {
		return;
	}

	const date = new Date();
	timeSpan.innerHTML = date.toLocaleTimeString();
}



headerDateHandler();
setInterval(headerDateHandler, 60000);

headerTimeHandler();
setInterval(headerTimeHandler, 1000);

