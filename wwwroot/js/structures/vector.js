/**
 * @typedef {object} Vector
 * @property {number} x The x component of a vector.
 * @property {number} y The y component of a vector.
 * @property {number} z The z component of a vector.
 */

/**
 * Vector class with utilities. Provides both static and mutating utilities for
 * most vector operations.
 */
export class VectorUtil {

	/**
	 * Creates a new Vector object literal
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} z
	 *
	 * @returns {Vector}
	 */
	static create(x = 0, y = 0, z = 0) {
		return {
			x,
			y,
			z
		};
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
		return VectorUtil.create(
			vector.x + xOffset,
			vector.y + yOffset,
			vector.z + zOffset
		);
	}

	/**
	 * Gets the resultant vector of adding two vectors.
	 *
	 * @param {Vector} vector1
	 * @param {Vector} vector2
	 *
	 * @returns {Vector}
	 */
	static add(vector1, vector2) {
		return VectorUtil.create(
			vector1.x + vector2.x,
			vector1.y + vector2.y,
			vector1.z + vector2.z
		);
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
		return VectorUtil.create(
			vector1.x - vector2.x,
			vector1.y - vector2.y,
			vector1.z - vector2.z
		);
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
		return VectorUtil.create(
			vector.x * scale,
			vector.y * scale,
			vector.z * scale
		);
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
		return VectorUtil.create(
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
	 * Performs cross product operation on two vectors.
	 *
	 * @param {Vector} vector1
	 * @param {Vector} vector2
	 *
	 * @returns {Vector}
	 */
	static cross(vector1, vector2) {
		return VectorUtil.create(
			vector1.y * vector2.z - vector1.z * vector2.y,
			vector1.z * vector2.x - vector1.x * vector2.z,
			vector1.x * vector2.y - vector1.y * vector2.x
		);
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
		const magnitude = VectorUtil.mag(vector);
		if (magnitude <= limit) {
			return VectorUtil.create(
				vector.x,
				vector.y,
				vector.z
			);
		}

		const normalizedVector = VectorUtil.normalize(vector);
		return VectorUtil.mult(normalizedVector, limit);
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
		const magnitude = VectorUtil.mag(vector);
		if (magnitude > lowerBound && magnitude < upperBound) {
			return VectorUtil.create(
				vector.x,
				vector.y,
				vector.z
			);
		}

		const normalizedVector = VectorUtil.normalize(vector);
		if (magnitude < lowerBound) {
			return VectorUtil.mult(normalizedVector, lowerBound);
		} else {
			return VectorUtil.mult(normalizedVector, upperBound);
		}
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
	 * Normalizes a Vector so its magnitude is 1.
	 *
	 * @param {Vector} vector
	 *
	 * @returns {Vector}
	 */
	static normalize(vector) {
		const magnitude = VectorUtil.mag(vector);

		if (magnitude === 0) {
			return VectorUtil.create(
				vector.x,
				vector.y,
				vector.z
			);
		}

		const xComponent = vector.x / magnitude;
		const yComponent = vector.y / magnitude;
		const zComponent = vector.z / magnitude;

		return VectorUtil.create(
			xComponent,
			yComponent,
			zComponent
		);
	}

	/**
	 * Gets the distance between two vectors.
	 *
	 * @param {Vector} vector1
	 * @param {Vector} vector2
	 */
	static distance(vector1, vector2) {
		return VectorUtil.mag(VectorUtil.sub(vector1, vector2));
	}

	/**
	 * Creates a random vector where each component is between -1 and 1.
	 *
	 * @returns {Vector}
	 */
	static random() {
		const vector = VectorUtil.create(
			Math.random() * 2 - 1,
			Math.random() * 2 - 1,
			Math.random() * 2 - 1
		);

		return vector;
	}
}
