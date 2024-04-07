export class Point {
	/**
	 * Constructs a instance of a point
	 *
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Determines if two points are equal.
	 *
	 * @param {Point} point
	 *
	 * @returns {boolean}
	 */
	equal(point) {
		return this.x === point.x && this.y === point.y;
	}
}
