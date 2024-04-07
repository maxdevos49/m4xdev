/**
 * Note: Unsure if this is the proper buffer type name based on the implementation but it is the closest to what I need.
 *
 * @template T
 */
export class CircularBuffer {
	/** @type {number} */
	#capacity;

	/** @type {Array<T>} */
	#data;

	/**
	 * Constructs an instance of a queue.
	 *
	 * @param {number} capacity
	 */
	constructor(capacity) {
		this.#capacity = capacity;
		this.#data = [];
	}

	/**
	 * Inserts a new value into the buffer.
	 *
	 * @param {T} value
	 *
	 * @returns {T|null} The oldest value T if the buffer is at capacity. Otherwise null.
	 */
	put(value) {
		this.#data.push(value);

		if (this.#data.length > this.#capacity) {
			return this.#data.shift() ?? null;
		}

		return null;
	}

	/**
	 * Gets the entire set of data currently inside the buffer.
	 *
	 * @returns {Array<T>}
	 */
	data() {
		return this.#data;
	}
}

