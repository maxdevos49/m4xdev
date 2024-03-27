
/**
 * Applies a filter to an image. Performs the operation inside a webworker so the
 * page is not blocked.
 *
 * @param {"grayscale"| "sobel"} filterType
 * @param {ImageData} imageData
 * @returns {Promise<ImageData>}
 */
export function FilterImageData(filterType, imageData) {
	return new Promise((resolve, reject) => {
		const filterWorker = new Worker("/js/canvas/filter-worker.js");
		filterWorker.postMessage({
			type: filterType,
			imageData
		});

		/** @type {(e: MessageEvent<ImageData>) => void} */
		filterWorker.onmessage = (e) => {
			filterWorker.terminate();
			resolve(e.data);
		};

		filterWorker.onerror = (error) => {
			filterWorker.terminate();
			reject(error);
		};
	});
}
