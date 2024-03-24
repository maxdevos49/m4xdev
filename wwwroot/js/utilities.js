
export const MONTH_STRINGS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const DAY_STRINGS = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];

/**
 * Converts a number to a string with its ordinal suffix
 *
 * @author https://stackoverflow.com/a/31615643/9318621
 *
 * @param {number} n The number to convert.
 * @returns {string} The number string with a ordinal suffix.
 */
export function toOrdinal(n) {
	const s = ["th", "st", "nd", "rd"];
	const v = n % 100;
	return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
