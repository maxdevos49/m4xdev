import {Rectangle} from "./rectangle.js";
import {Vector} from "./vector.js";

export class BarnesHutQuadTree {
	/** @type {Rectangle} */
	#bounds;

	/** @type {import("./particle.js").Particle|null} */
	#particle;

	/**@type {[BarnesHutQuadTree|null, BarnesHutQuadTree|null, BarnesHutQuadTree|null, BarnesHutQuadTree|null]} */
	#quadrants;

	/** @type {Vector} */
	#centerOfMass;
	/** @type {number} */
	#totalMass;

	/** @type {boolean} */
	#leaf;

	/**
	 * Constructs an instance of a QuadTree.
	 *
	 * @param {Rectangle} bounds
	 */
	constructor(bounds) {
		this.#bounds = bounds;

		this.#particle = null;
		this.#quadrants = [null, null, null, null];
		this.#centerOfMass = new Vector();
		this.#totalMass = 0;
		this.#leaf = true;
	}

	get leaf() {
		return this.#leaf;
	}

	get particle() {
		return this.#particle;
	}

	get centerOfMass() {
		return this.#centerOfMass;
	}

	get totalMass() {
		return this.#totalMass;
	}

	get width() {
		return this.#bounds.width;
	}

	get quadrants() {
		return this.#quadrants;
	}

	/**
	 * Insert a point into the QuadTree.
	 *
	 * @param {import("./particle.js").Particle} particle
	 *
	 * @returns {boolean}
	 */
	insert(particle) {
		if (!this.#bounds.contains(particle.position)) {
			return false;
		}

		// Xc = (m1*x1 + m2+x2)/(m1+m2)
		this.#centerOfMass.x = (this.#totalMass * this.#centerOfMass.x + particle.mass * particle.position.x) / (this.#totalMass + particle.mass);
		// Yc = (m1*y1 + m2+y2)/(m1+m2)
		this.#centerOfMass.y = (this.#totalMass * this.#centerOfMass.y + particle.mass * particle.position.y) / (this.#totalMass + particle.mass);
		this.#totalMass += particle.mass;

		if (this.#particle === null && this.#leaf) {
			this.#particle = particle;
			return true;
		}

		// Move existing particle down to the lowest level
		if (this.#particle !== null) {
			const existingParticle = this.#particle;
			this.#particle = null;
			this.#leaf = false;

			const existingIndex = this.#whichQuadrantIndex(existingParticle);
			if (this.#quadrants[existingIndex] === null) {
				this.#quadrants[existingIndex] = new BarnesHutQuadTree(this.#quadrantBounds(existingIndex));
			}

			this.#quadrants[existingIndex]?.insert(particle);
		}

		// Place new particle into its quadrant.
		const index = this.#whichQuadrantIndex(particle);
		if (this.#quadrants[index] === null) {
			this.#quadrants[index] = new BarnesHutQuadTree(this.#quadrantBounds(index));
		}

		return this.#quadrants[index]?.insert(particle) ?? false;
	}

	/**
	 * Determines which quadrant a point is within.
	 *
	 * @param {import("./particle.js").Particle} point
	 *
	 * @returns {0|1|2|3}
	 */
	#whichQuadrantIndex(point) {
		if (point.position.x > this.#bounds.centerX && point.position.y < this.#bounds.centerY) {
			return 0;// ne
		} else if (point.position.x > this.#bounds.centerX && point.position.y > this.#bounds.centerY) {
			return 1; // se
		} else if (point.position.x < this.#bounds.centerX && point.position.y > this.#bounds.centerY) {
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
	 * @param {import("./particle.js").Particle[]} found
	 *
	 * @returns {import("./particle.js").Particle[]}
	 */
	query(range, found = []) {
		if (!this.#bounds.intersects(range)) {
			return found;
		} else {
			if (this.#particle !== null && range.contains(this.#particle.position)) {//TODO is this correct??
				found.push(this.#particle);
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

		ctx.fillStyle = "orange";
		ctx.fillRect(this.#centerOfMass.x / simulationScale - 1, this.#centerOfMass.y / simulationScale - 1, 2, 2);

		for (const quadrant of this.#quadrants) {
			quadrant?.show(ctx, simulationScale);
		}
	}
}
