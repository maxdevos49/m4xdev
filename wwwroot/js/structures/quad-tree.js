import {Rectangle} from "./rectangle.js";

export class QuadTree {
	/** @type {Rectangle} */
	#bounds;
	/** @type {number} */
	#capacity;
	/** @type {Array<import("./point.js").Point>} */
	#points;

	/**@type {QuadTree|null} */
	#ne;
	/** @type {Rectangle} */
	#neBounds;

	/**@type {QuadTree|null} */
	#se;
	/** @type {Rectangle} */
	#seBounds;

	/**@type {QuadTree|null} */
	#sw;
	/** @type {Rectangle} */
	#swBounds;

	/**@type {QuadTree|null} */
	#nw;
	/** @type {Rectangle} */
	#nwBounds;


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

		const {x, y, width: w, height: h} = this.#bounds;

		this.#ne = null;
		this.#neBounds = new Rectangle(x + w / 2, y, w / 2, h / 2);

		this.#se = null;
		this.#seBounds = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);

		this.#sw = null;
		this.#swBounds = new Rectangle(x, y + h / 2, w / 2, h / 2);

		this.#nw = null;
		this.#nwBounds = new Rectangle(x, y, w / 2, h / 2);

	}

	/**
	 * Insert a point into the QuadTree.
	 *
	 * @param {import("./point.js").Point} point
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

		if (this.#neBounds.contains(point)) {
			if (this.#ne === null) {
				this.#ne = new QuadTree(this.#neBounds, this.#capacity);
			}

			return this.#ne.insert(point);
		}

		if (this.#seBounds.contains(point)) {
			if (this.#se === null) {
				this.#se = new QuadTree(this.#seBounds, this.#capacity);
			}

			return this.#se.insert(point);
		}

		if (this.#swBounds.contains(point)) {
			if (this.#sw === null) {
				this.#sw = new QuadTree(this.#swBounds, this.#capacity);
			}

			return this.#sw.insert(point);
		}

		if (this.#nwBounds.contains(point)) {
			if (this.#nw === null) {
				this.#nw = new QuadTree(this.#nwBounds, this.#capacity);
			}

			return this.#nw.insert(point);
		}

		return false;
	}

	/**
	 * Queries the points located inside a given range.
	 *
	 * @param {Rectangle} range
	 * @param {import("./point.js").Point[]} found
	 *
	 * @returns {import("./point.js").Point[]}
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

		this.#ne?.query(range, found);
		this.#se?.query(range, found);
		this.#sw?.query(range, found);
		this.#nw?.query(range, found);

		return found;
	}

	/**
	 * Renders a QuadTree boundaries.
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 */
	show(ctx) {
		ctx.beginPath();
		ctx.strokeStyle = "green";
		ctx.rect(this.#bounds.x, this.#bounds.y, this.#bounds.width, this.#bounds.height);
		ctx.stroke();

		this.#ne?.show(ctx);
		this.#se?.show(ctx);
		this.#sw?.show(ctx);
		this.#nw?.show(ctx);
	}
}
