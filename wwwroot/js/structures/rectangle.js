export class Rectangle {

	#x;
	#y;
	#w;
	#h;

	/**
	 * Constructs a instance of a rectangle.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 */
	constructor(x, y, width, height) {
		this.#x = x;
		this.#y = y;
		this.#w = width;
		this.#h = height;
	}

	get x() {
		return this.#x;
	}

	get y() {
		return this.#y;
	}

	get width() {
		return this.#w;
	}

	get height() {
		return this.#h;
	}

	get top() {
		return this.#y;
	}

	get right() {
		return this.#x + this.#w;
	}

	get bottom() {
		return this.#y + this.#h;
	}

	get left() {
		return this.#x;
	}

	get centerX() {
		return this.#x + this.#w / 2;
	}

	get centerY() {
		return this.#y + this.#h / 2;
	}

	/**
	 * Indicates if a point is inside the rectangle.
	 *
	 * @param {import("./vector.js").Vector} point
	 *
	 * @returns {boolean}
	 */
	contains(point) {
		return (
			point.x >= this.left
			&& point.x < this.right
			&& point.y >= this.top
			&& point.y < this.bottom
		);
	}

	/**
	 * Indicates if another rectangle is intersecting with the current rectangle.
	 *
	 * @param {Rectangle} other
	 *
	 * @returns {boolean}
	 */
	intersects(other) {
		return !(
			other.x - other.width > this.x + this.width ||
			other.x + other.width < this.x - this.width ||
			other.y - other.height > this.y + this.height ||
			other.y + other.height < this.y - this.height
		);
	}
}
