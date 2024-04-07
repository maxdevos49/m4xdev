import {Point} from "./point.js";

/**
 * Vector class with utilities. Provides both static and mutating utilities for
 * most vector operations.
 */
export class Vector {

	/**
	 * Creates a new instance of a Vector
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} z
	 */
	constructor(x = 0, y = 0, z = 0) {
		/**
		 * Vector x component.
		 *
		 * @public
		 * @type {number}
		 */
		this.x = x;

		/**
		 * Vector y component.
		 *
		 * @public
		 * @type {number}
		 */
		this.y = y;

		/**
		 * Vector z component.
		 *
		 * @public
		 * @type {number}
		 */
		this.z = z;
	}

	/**
	 * Translates the vector by the given offsets.
	 *
	 * @param {number} xOffset
	 * @param {number} yOffset
	 * @param {number} zOffset
	 *
	 * @returns {Vector}
	 */
	translate(xOffset = 0, yOffset = 0, zOffset = 0) {
		this.x += xOffset;
		this.y += yOffset;
		this.z += zOffset;

		return this;
	}

	/**
	 * Translates a vector by the given offsets.
	 *
	 * @param {Vector} vector
	 * @param {number} xOffset
	 * @param {number} yOffset
	 * @param {number} zOffset
	 *
	 * @returns {Vector}
	 */
	static translate(vector, xOffset = 0, yOffset = 0, zOffset = 0) {
		return new Vector(
			vector.x + xOffset,
			vector.y + yOffset,
			vector.z + zOffset
		);
	}

	/**
	 * Adds another vector to this vector.
	 *
	 * @param {Vector} vector
	 *
	 * @returns {Vector}
	 */
	add(vector) {
		this.x += vector.x;
		this.y += vector.y;
		this.z += vector.z;

		return this;
	}

	/**
	 * Gets the resultant vector of adding two vectors.
	 *
	 * @param {Vector} vector1
	 * @param {Vector} vector2
	 */
	static add(vector1, vector2) {
		return new Vector(
			vector1.x + vector2.x,
			vector1.y + vector2.y,
			vector1.z + vector2.z
		);
	}

	/**
	 * Subtracts another vector from this vector.
	 *
	 * @param {Vector} vector
	 *
	 * @returns {Vector}
	 */
	sub(vector) {
		this.x -= vector.x;
		this.y -= vector.y;
		this.z -= vector.z;

		return this;
	}

	/**
	 * Gets the difference of two vectors. Subtracts the second vector from the first.
	 *
	 * @param {Vector} vector1
	 * @param {Vector} vector2
	 *
	 * @returns {Vector}
	 */
	static sub(vector1, vector2) {
		return new Vector(
			vector1.x - vector2.x,
			vector1.y - vector2.y,
			vector1.z - vector2.z
		);
	}

	/**
	 * Multiplies this Vector by a scalar.
	 *
	 * @param {number} scale
	 *
	 * @returns {Vector}
	 */
	mult(scale) {
		this.x *= scale;
		this.y *= scale;
		this.z *= scale;

		return this;
	}

	/**
	 * Multiplies a Vector by a scalar.
	 *
	 * @param {Vector} vector
	 * @param {number} scale
	 *
	 * @returns {Vector}
	 */
	static mult(vector, scale) {
		return new Vector(
			vector.x * scale,
			vector.y * scale,
			vector.z * scale
		);
	}

	/**
	 * Divides the Vector by a scalar value.
	 *
	 * @param {number} scale
	 *
	 * @returns {Vector}
	 */
	div(scale) {
		this.x /= scale;
		this.y /= scale;
		this.z /= scale;

		return this;
	}

	/**
	 * Divides a Vector by a scalar value.
	 *
	 * @param {Vector} vector
	 * @param {number} scale
	 *
	 * @returns {Vector}
	 */
	static div(vector, scale) {
		return new Vector(
			vector.x / scale,
			vector.y / scale,
			vector.z / scale
		);
	}

	/**
	 * Performs the dot product on two vectors.
	 *
	 * @param {Vector} vector1
	 * @param {Vector} vector2
	 *
	 * @returns {number}
	 */
	static dot(vector1, vector2) {
		const xComponent = vector1.x * vector2.x;
		const yComponent = vector1.y * vector2.y;
		const zComponent = vector1.z * vector2.z;

		return xComponent + yComponent + zComponent;
	}

	/**
	 * Performs the cross product operation with another vector.
	 *
	 * @param {Vector} vector
	 *
	 * @returns {Vector}
	 */
	cross(vector) {
		this.x = this.y * vector.z - this.z * vector.y;
		this.y = this.z * vector.x - this.x * vector.z;
		this.z = this.x * vector.y - this.y * vector.x;

		return this;
	}

	/**
	 * Performs cross product operation on two vectors.
	 *
	 * @param {Vector} vector1
	 * @param {Vector} vector2
	 *
	 * @returns {Vector}
	 */
	static cross(vector1, vector2) {
		return new Vector(
			vector1.y * vector2.z - vector1.z * vector2.y,
			vector1.z * vector2.x - vector1.x * vector2.z,
			vector1.x * vector2.y - vector1.y * vector2.x
		);
	}

	/**
	 * Limits the Vectors magnitude to a specific value. If the magnitude is less
	 * then the limit the Vector is not modified.
	 *
	 * @param {number} limit
	 *
	 * @returns {Vector}
	 */
	limit(limit) {
		const magnitude = this.mag();
		if (magnitude <= limit) {
			return this;
		}

		return this
			.normalize()
			.mult(limit);
	}

	/**
	 * Limits a Vectors magnitude to a specific value. If the magnitude is less
	 * then the limit the identical vector is returned.
	 *
	 * @param {Vector} vector
	 * @param {number} limit
	 *
	 * @returns {Vector}
	 */
	static limit(vector, limit) {
		const magnitude = Vector.mag(vector);
		if (magnitude <= limit) {
			return new Vector(
				vector.x,
				vector.y,
				vector.z
			);
		}

		const normalizedVector = Vector.normalize(vector);
		return Vector.mult(normalizedVector, limit);
	}

	/**
	 * Limits a Vectors magnitude within a range. If the vectors magnitude is
	 * within the given range an identical vector is returned.
	 *
	 * @param {number} lowerBound
	 * @param {number} upperBound
	 *
	 * @returns {Vector}
	 */
	constrain(lowerBound, upperBound) {
		const magnitude = Vector.mag(this);
		if (magnitude > lowerBound && magnitude < upperBound) {
			return this;
		}

		return this
			.normalize()
			.mult(magnitude < lowerBound ? lowerBound : upperBound);
	}

	/**
	 * Limits a Vectors magnitude within a range. If the vectors magnitude is
	 * within the given range an identical vector is returned.
	 *
	 * @param {Vector} vector
	 * @param {number} lowerBound
	 * @param {number} upperBound
	 *
	 * @returns {Vector}
	 */
	static constrain(vector, lowerBound, upperBound) {
		const magnitude = Vector.mag(vector);
		if (magnitude > lowerBound && magnitude < upperBound) {
			return new Vector(
				vector.x,
				vector.y,
				vector.z
			);
		}

		const normalizedVector = Vector.normalize(vector);
		if (magnitude < lowerBound) {
			return Vector.mult(normalizedVector, lowerBound);
		} else {
			return Vector.mult(normalizedVector, upperBound);
		}
	}

	/**
	 * Gets the magnitude of the vector.
	 *
	 * @returns {number}
	 */
	mag() {
		return Vector.mag(this);
	}

	/**
	 * Gets the magnitude of a vector.
	 *
	 * @param {Vector} vector
	 *
	 * @returns {number}
	 */
	static mag(vector) {
		const xComponent = vector.x * vector.x;
		const yComponent = vector.y * vector.y;
		const zComponent = vector.z * vector.z;

		const magnitude = Math.sqrt(xComponent + yComponent + zComponent);

		return Math.abs(magnitude);
	}

	/**
	 * Normalizes the Vector so its magnitude is 1.
	 *
	 * @returns {Vector}
	 */
	normalize() {
		const magnitude = this.mag();

		if (magnitude === 0) {
			return this;
		}

		this.x = this.x / magnitude;
		this.y = this.y / magnitude;
		this.z = this.z / magnitude;

		return this;
	}

	/**
	 * Normalizes a Vector so its magnitude is 1.
	 *
	 * @param {Vector} vector
	 *
	 * @returns {Vector}
	 */
	static normalize(vector) {
		const magnitude = Vector.mag(vector);

		if (magnitude === 0) {
			return new Vector(
				vector.x,
				vector.y,
				vector.z
			);
		}

		const xComponent = vector.x / magnitude;
		const yComponent = vector.y / magnitude;
		const zComponent = vector.z / magnitude;

		return new Vector(
			xComponent,
			yComponent,
			zComponent
		);
	}

	/**
	 * Creates a random vector where each component is between -1 and 1.
	 *
	 * @returns {Vector}
	 */
	static random() {
		const vector = new Vector(
			Math.random() * 2 - 1,
			Math.random() * 2 - 1,
			Math.random() * 2 - 1
		);

		return vector;
	}

	/**
	 * Converts the vector into a 2D point.
	 *
	 * @returns {Point}
	 */
	toPoint() {
		return new Point(this.x, this.y);
	}
}
