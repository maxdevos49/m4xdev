import {Rectangle} from "./rectangle.js";

export class QuadTree {
	/** @type {Rectangle} */
	#bounds;
	/** @type {number} */
	#capacity;
	/** @type {Array<import("./vector.js").Vector>} */
	#points;

	/**@type {[QuadTree|null, QuadTree|null, QuadTree|null, QuadTree|null]} */
	#quadrants;

	/**
	 * Constructs an instance of a QuadTree.
	 *
	 * @param {Rectangle} bounds
	 * @param {number} capacity
	 */
	constructor(bounds, capacity) {
		this.#bounds = bounds;
		this.#capacity = capacity;
		this.#points = [];

		this.#quadrants = [null, null, null, null];
	}

	/**
	 * Insert a point into the QuadTree.
	 *
	 * @param {import("./vector.js").Vector} point
	 *
	 * @returns {boolean}
	 */
	insert(point) {
		if (!this.#bounds.contains(point)) {
			return false;
		}

		if (this.#points.length < this.#capacity) {
			this.#points.push(point);

			return true;
		}

		const index = this.#whichQuadrantIndex(point);

		if (this.#quadrants[index] === null) {
			this.#quadrants[index] = new QuadTree(this.#quadrantBounds(index), this.#capacity);
		}

		return this.#quadrants[index]?.insert(point) ?? false;
	}

	/**
	 * Determines which quadrant a point is within.
	 *
	 * @param {import("./vector.js").Vector} point
	 *
	 * @returns {0|1|2|3}
	 */
	#whichQuadrantIndex(point) {
		if (point.x > this.#bounds.centerX && point.y < this.#bounds.centerY) {
			return 0;// ne
		} else if (point.x > this.#bounds.centerX && point.y > this.#bounds.centerY) {
			return 1; // se
		} else if (point.x < this.#bounds.centerX && point.y > this.#bounds.centerY) {
			return 2; // sw
		} else {
			return 3;// nw
		}
	}

	/**
	 * Gets the bounds for the given quadrant
	 *
	 * @param {0|1|2|3} index
	 *
	 * @returns {Rectangle}
	 */
	#quadrantBounds(index) {
		const {x, y, width, height, centerX, centerY} = this.#bounds;

		if (index === 0) {
			return new Rectangle(centerX, y, width / 2, height / 2);
		} else if (index === 1) {
			return new Rectangle(centerX, centerY, width / 2, height / 2);
		} else if (index === 2) {
			return new Rectangle(x, centerY, width / 2, height / 2);
		} else {
			return new Rectangle(x, y, width / 2, height / 2);
		}
	}

	/**
	 * Queries the points located inside a given range.
	 *
	 * @param {Rectangle} range
	 * @param {import("./vector.js").Vector[]} found
	 *
	 * @returns {import("./vector.js").Vector[]}
	 */
	query(range, found = []) {
		if (!this.#bounds.intersects(range)) {
			return found;
		} else {
			for (const point of this.#points) {
				if (range.contains(point)) {
					found.push(point);
				}
			}
		}

		this.#quadrants[0]?.query(range, found);
		this.#quadrants[1]?.query(range, found);
		this.#quadrants[2]?.query(range, found);
		this.#quadrants[3]?.query(range, found);

		return found;
	}

	/**
	 * Renders a QuadTree boundaries.
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {number} simulationScale
	 */
	show(ctx, simulationScale) {
		ctx.beginPath();
		ctx.strokeStyle = "green";
		ctx.rect(this.#bounds.x / simulationScale, this.#bounds.y / simulationScale, this.#bounds.width / simulationScale, this.#bounds.height / simulationScale);
		ctx.stroke();

		for (const quadrant of this.#quadrants) {
			quadrant?.show(ctx, simulationScale);
		}
	}
}
