/**
 * @typedef {() => void} Unsubscriber
 */

/**
 * @template T
 *
 * @typedef {(value: T) => void} Subscriber<T>
 */

/**
 * @template T
 *
 * @typedef {object} Signal<T> Data type
 * @property {() => T} get A getter for the signal value.
 * @property {(value: T) => void} set A setter for the signal value.
 * @property {(subscriber: Subscriber<T>) => Unsubscriber} subscribe Subscribe handler functions to be notified when the signal is changed.
 */


/**
 * Creates a signal data type.
 *
 * @template T
 *
 * @param {T} initialValue
 *
 * @returns {Signal<T>}
 */
export function createSignal(initialValue) {
	let _v = initialValue;
	/**@type {Array<Subscriber<T>>} */
	let subscribers = [];

	const notify = () => {
		for (const subscriber of subscribers) {
			subscriber(_v);
		}
	};

	return {
		get: () => {
			return _v;
		},
		set: (value) => {
			if (value !== _v) {
				_v = value;
				notify();
			}
		},
		subscribe: (subscriber) => {
			subscribers.push(subscriber);

			subscriber(_v);

			return () => {
				const indexToRemove = subscribers.indexOf(subscriber);
				if (indexToRemove !== -1) {
					subscribers.splice(indexToRemove, 1);
				}
			};
		}
	};
}
